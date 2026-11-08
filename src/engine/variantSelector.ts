import { ExerciseName, PrescribedZone, VariantTableEntry } from './types';
import { CLASSIC_INTENSITY_TABLE, PULLS_INTENSITY_TABLE } from './constants';
import { apportionLargestRemainder, ApportionmentItem, roundToNearestKg } from './apportionment';

export interface SelectedVariantResult {
  code: string;
  imrNominal: number;
  variantLetter: string;
  targetImr: number;
  realImr: number;
  imrError: number;
  zones: PrescribedZone[];
  distributionPercentages: { [intensity: string]: number };
}

/**
 * Determina si el ejercicio utiliza la tabla de halones (preparación física de tracción)
 * o la tabla clásica (arranque, envión, cuclillas).
 */
export function isPullExercise(exercise: ExerciseName): boolean {
  return exercise === 'Snatch Pulls' || exercise === 'Clean Pulls';
}

/**
 * Obtiene la tabla correspondiente al tipo de ejercicio.
 */
export function getExerciseTable(exercise: ExerciseName): Record<string, VariantTableEntry> {
  return isPullExercise(exercise) ? PULLS_INTENSITY_TABLE : CLASSIC_INTENSITY_TABLE;
}

/**
 * Clampeo seguro al rango de IMRs disponibles en las tablas originales.
 * Clásicos: 45 a 80
 * Halones: 65 a 100
 */
export function clampImrToTableRange(imr: number, isPulls: boolean): number {
  const rounded = Math.round(imr);
  if (isPulls) {
    return Math.max(65, Math.min(100, rounded));
  }
  return Math.max(45, Math.min(80, rounded));
}

/**
 * Selecciona automáticamente la mejor variante (A, B o C) según las prioridades matemáticas:
 * 1. Minimizar la desviación absoluta respecto a la IMR objetivo: |IMR_real - IMR_target|.
 * 2. En caso de empate, minimizar la distorsión de redondeo: sum( (reps_asignadas - reps_teóricas)^2 ).
 * 3. En caso de persistir el empate, desempate determinista lexicográfico (A > B > C).
 */
export function selectOptimalVariant(
  exercise: ExerciseName,
  targetReps: number,
  targetImr: number,
  referenceKg: number
): SelectedVariantResult {
  const isPulls = isPullExercise(exercise);
  const table = getExerciseTable(exercise);
  const lookupImr = clampImrToTableRange(targetImr, isPulls);

  const letters = ['a', 'b', 'c'];
  const availableVariants: VariantTableEntry[] = [];

  for (const letter of letters) {
    const code = `${lookupImr}${letter}`;
    if (table[code]) {
      availableVariants.push(table[code]);
    }
  }

  // Si por alguna razón ninguna variante directa existiese, buscar códigos coincidentes
  if (availableVariants.length === 0) {
    for (const entry of Object.values(table)) {
      if (entry.imr === lookupImr) {
        availableVariants.push(entry);
      }
    }
  }

  // Fallback de emergencia si la tabla no tuviese esa IMR (no debería ocurrir nunca)
  if (availableVariants.length === 0) {
    const defaultEntry = Object.values(table)[0];
    availableVariants.push(defaultEntry);
  }

  // Si las repeticiones son 0, retornar la primera variante con 0 reps
  if (targetReps <= 0) {
    const v = availableVariants[0];
    const emptyZones: PrescribedZone[] = Object.keys(v.distribution).map(k => {
      const pct = parseFloat(k);
      const theoKg = (referenceKg * pct) / 100;
      return {
        intensityPercent: pct,
        theoreticalKg: theoKg,
        loadKg: roundToNearestKg(theoKg),
        effectiveIntensityPercent: referenceKg > 0 ? (roundToNearestKg(theoKg) / referenceKg) * 100 : pct,
        reps: 0
      };
    });

    return {
      code: v.code,
      imrNominal: v.imr,
      variantLetter: v.variant,
      targetImr,
      realImr: targetImr,
      imrError: 0,
      zones: emptyZones,
      distributionPercentages: v.distribution
    };
  }

  // Evaluar cada variante candidata
  interface CandidateEvaluation {
    variant: VariantTableEntry;
    realImr: number;
    imrError: number;
    roundingDistortion: number;
    zones: PrescribedZone[];
  }

  const evaluations: CandidateEvaluation[] = availableVariants.map(variant => {
    // Convertir distribución a items de reparto
    const items: ApportionmentItem<number>[] = Object.entries(variant.distribution).map(([intensityStr, pct]) => ({
      key: parseFloat(intensityStr),
      weight: pct
    }));

    // Reparto entero exacto
    const apportionment = apportionLargestRemainder(items, targetReps);

    // Calcular repeticiones asignadas por zona
    let sumRepsXIntensity = 0;
    let roundingDistortion = 0;

    const zones: PrescribedZone[] = apportionment.map(res => {
      const intensity = res.key;
      const reps = res.allocated;
      const theoKg = (referenceKg * intensity) / 100;
      const loadKg = roundToNearestKg(theoKg);
      const effectivePct = referenceKg > 0 ? (loadKg / referenceKg) * 100 : intensity;

      sumRepsXIntensity += reps * intensity;
      roundingDistortion += Math.pow(reps - res.exactTarget, 2);

      return {
        intensityPercent: intensity,
        theoreticalKg: theoKg,
        loadKg,
        effectiveIntensityPercent: effectivePct,
        reps
      };
    });

    const realImr = targetReps > 0 ? sumRepsXIntensity / targetReps : targetImr;
    const imrError = Math.abs(realImr - targetImr);

    return {
      variant,
      realImr,
      imrError,
      roundingDistortion,
      zones
    };
  });

  // Ordenar lexicográficamente según prioridades metodológicas:
  // 1. Menor error absoluto de IMR respecto al target
  // 2. Menor distorsión cuadrática de redondeo
  // 3. Letra de variante ('a' antes que 'b' antes que 'c')
  evaluations.sort((a, b) => {
    const diffError = a.imrError - b.imrError;
    if (Math.abs(diffError) > 1e-6) {
      return diffError;
    }

    const diffDistortion = a.roundingDistortion - b.roundingDistortion;
    if (Math.abs(diffDistortion) > 1e-6) {
      return diffDistortion;
    }

    return a.variant.variant.localeCompare(b.variant.variant);
  });

  const best = evaluations[0];

  return {
    code: best.variant.code,
    imrNominal: best.variant.imr,
    variantLetter: best.variant.variant,
    targetImr,
    realImr: best.realImr,
    imrError: best.imrError,
    zones: best.zones,
    distributionPercentages: best.variant.distribution
  };
}
