import {
  UserInputData,
  MesocyclePlan,
  ExerciseName,
  ReferenceLoads,
  ExerciseHierarchy,
  MicrocyclePlan,
  DailyPlan,
  DailyExercisePlan,
  MicrocycleExercisePlan,
  PrescribedZone
} from './types';
import {
  PERFORMANCE_RATIOS,
  DAYS_ORDER,
  DAILY_DISTRIBUTION_TABLE,
  MICROCYCLE_ALTERNATIVES,
  PULLS_IMR_OFFSET
} from './constants';
import {
  apportionLargestRemainder,
  biproportionalApportionment,
  ApportionmentItem,
  roundToNearestKg
} from './apportionment';
import { selectOptimalVariant } from './variantSelector';
import { auditMesocyclePlan } from './audit';

export function calculateMesocycle(input: UserInputData): MesocyclePlan {
  // Validaciones duras de entrada
  if (input.totalOlympicKg <= 0) {
    throw new Error('El Total Olímpico debe ser mayor a cero.');
  }
  if (input.totalReps <= 0 || !Number.isInteger(input.totalReps)) {
    throw new Error('El volumen del mesociclo debe ser un número entero positivo.');
  }
  if (input.ptPercent < 0 || input.ptPercent > 100) {
    throw new Error('El porcentaje de Preparación Técnica (PT) debe estar entre 0 y 100.');
  }
  if (input.snatchInPtPercent < 0 || input.snatchInPtPercent > 100) {
    throw new Error('El porcentaje de Snatch dentro de PT debe estar entre 0 y 100.');
  }
  if (input.squatsInPfPercent < 0 || input.squatsInPfPercent > 100) {
    throw new Error('El porcentaje de Squats dentro de PF debe estar entre 0 y 100.');
  }
  if (input.snatchPullsInPullsPercent < 0 || input.snatchPullsInPullsPercent > 100) {
    throw new Error('El porcentaje de Snatch Pulls dentro de Pulls debe estar entre 0 y 100.');
  }
  if (![2, 3, 4, 5].includes(input.durationMicros)) {
    throw new Error('La duración del mesociclo debe ser de 2, 3, 4 o 5 microciclos.');
  }
  if (!Number.isInteger(input.targetMesocycleImr)) {
    throw new Error('La IMR objetivo del mesociclo debe ser un número entero.');
  }

  // 1. Rendimientos Deportivos de Referencia (4.1)
  const totalKg = input.totalOlympicKg;
  const referenceLoads: ReferenceLoads = {
    totalOlympic: totalKg,
    snatch: totalKg * PERFORMANCE_RATIOS.Snatch,
    cleanAndJerk: totalKg * PERFORMANCE_RATIOS['Clean & Jerk'],
    squats: totalKg * PERFORMANCE_RATIOS.Squats,
    snatchPulls: totalKg * PERFORMANCE_RATIOS['Snatch Pulls'],
    cleanPulls: totalKg * PERFORMANCE_RATIOS['Clean Pulls'],
  };

  // 2. Jerarquía Porcentual de Ejercicios (4.3 y 4.4)
  const ptFraction = input.ptPercent / 100;
  const pfFraction = (100 - input.ptPercent) / 100;

  const snatchInPtFrac = input.snatchInPtPercent / 100;
  const cjInPtFrac = (100 - input.snatchInPtPercent) / 100;

  const squatsInPfFrac = input.squatsInPfPercent / 100;
  const pullsInPfFrac = (100 - input.squatsInPfPercent) / 100;

  const snatchPullsInPullsFrac = input.snatchPullsInPullsPercent / 100;
  const cleanPullsInPullsFrac = (100 - input.snatchPullsInPullsPercent) / 100;

  const proportions: Record<ExerciseName, number> = {
    Snatch: ptFraction * snatchInPtFrac,
    'Clean & Jerk': ptFraction * cjInPtFrac,
    Squats: pfFraction * squatsInPfFrac,
    'Snatch Pulls': pfFraction * pullsInPfFrac * snatchPullsInPullsFrac,
    'Clean Pulls': pfFraction * pullsInPfFrac * cleanPullsInPullsFrac,
  };

  const exerciseNames: ExerciseName[] = [
    'Snatch',
    'Clean & Jerk',
    'Squats',
    'Snatch Pulls',
    'Clean Pulls'
  ];

  // Reparto entero global de repeticiones por ejercicio en el mesociclo
  const exItems: ApportionmentItem<ExerciseName>[] = exerciseNames.map(ex => ({
    key: ex,
    weight: proportions[ex]
  }));
  const exApportionment = apportionLargestRemainder(exItems, input.totalReps);

  const targetRepsByExercise: Record<ExerciseName, number> = {} as any;
  for (const item of exApportionment) {
    targetRepsByExercise[item.key] = item.allocated;
  }

  const exerciseHierarchy: ExerciseHierarchy = {
    ptPercent: input.ptPercent,
    pfPercent: 100 - input.ptPercent,
    snatchInPtPercent: input.snatchInPtPercent,
    cleanAndJerkInPtPercent: 100 - input.snatchInPtPercent,
    squatsInPfPercent: input.squatsInPfPercent,
    pullsInPfPercent: 100 - input.squatsInPfPercent,
    snatchPullsInPullsPercent: input.snatchPullsInPullsPercent,
    cleanPullsInPullsPercent: 100 - input.snatchPullsInPullsPercent,
    proportions,
    targetReps: targetRepsByExercise,
  };

  // 3. Duración y Alternativa de Microciclos (6.1 y 6.3)
  const alternatives = MICROCYCLE_ALTERNATIVES[input.durationMicros];
  const altIndex = Math.max(0, Math.min(alternatives.length - 1, input.selectedAlternativeIndex));
  const selectedAlt = alternatives[altIndex];

  // Reparto entero global de repeticiones por microciclo
  const microItems: ApportionmentItem<number>[] = selectedAlt.volumePercentages.map((pct, idx) => ({
    key: idx,
    weight: pct
  }));
  const microApportionment = apportionLargestRemainder(microItems, input.totalReps);
  const microcycleTotals = microApportionment.map(a => a.allocated);

  // 4. Reparto Biproporcional de Repeticiones: Ejercicios x Microciclos
  // Filas: Ejercicios (targetRepsByExercise), Columnas: Microciclos (microcycleTotals)
  const rowTotals = exerciseNames.map(ex => targetRepsByExercise[ex]);
  const colTotals = microcycleTotals;

  const idealWeights: number[][] = exerciseNames.map(ex => 
    selectedAlt.volumePercentages.map(pct => proportions[ex] * (pct / 100))
  );

  const exMicroMatrix = biproportionalApportionment(
    exerciseNames,
    selectedAlt.volumePercentages.map((_, i) => `Micro_${i + 1}`),
    rowTotals,
    colTotals,
    idealWeights
  );

  // 5. Construcción de Cada Microciclo
  const microcycles: MicrocyclePlan[] = [];

  let grandTotalRepsXIntensity = 0;

  for (let mIdx = 0; mIdx < input.durationMicros; mIdx++) {
    const microNumber = mIdx + 1;
    const volPct = selectedAlt.volumePercentages[mIdx];
    const microActualReps = microcycleTotals[mIdx];
    const displacement = selectedAlt.imrDisplacements[mIdx];
    const targetImr = input.targetMesocycleImr + displacement;

    // A. Selección de variante para cada ejercicio en este microciclo
    const microExercises: Record<ExerciseName, MicrocycleExercisePlan> = {} as any;
    const selectedVariantsByEx: Record<ExerciseName, any> = {} as any;

    for (let eIdx = 0; eIdx < exerciseNames.length; eIdx++) {
      const ex = exerciseNames[eIdx];
      const exMicroReps = exMicroMatrix[eIdx][mIdx];
      const refKg = referenceLoads[
        ex === 'Snatch' ? 'snatch' :
        ex === 'Clean & Jerk' ? 'cleanAndJerk' :
        ex === 'Squats' ? 'squats' :
        ex === 'Snatch Pulls' ? 'snatchPulls' : 'cleanPulls'
      ];

      // IMR objetivo del ejercicio en este microciclo
      // Halones utilizan su escala propia desplazada metodológicamente (+21)
      const exTargetImr = (ex === 'Snatch Pulls' || ex === 'Clean Pulls')
        ? targetImr + PULLS_IMR_OFFSET
        : targetImr;

      const variantSelection = selectOptimalVariant(ex, exMicroReps, exTargetImr, refKg);
      selectedVariantsByEx[ex] = variantSelection;

      microExercises[ex] = {
        exercise: ex,
        reps: exMicroReps,
        targetImr: exTargetImr,
        realImr: variantSelection.realImr,
        imrError: variantSelection.imrError,
        variantCode: variantSelection.code,
        zones: variantSelection.zones
      };
    }

    // B. Distribución Diaria (Lunes a Sábado) para cada ejercicio
    // Matriz de repeticiones: exercise x day (6 días)
    const exDailyReps: number[][] = [];
    for (let eIdx = 0; eIdx < exerciseNames.length; eIdx++) {
      const ex = exerciseNames[eIdx];
      const exMicroReps = exMicroMatrix[eIdx][mIdx];
      const dayWeights = DAILY_DISTRIBUTION_TABLE[ex];

      const dayItems: ApportionmentItem<number>[] = dayWeights.map((w, dIdx) => ({
        key: dIdx,
        weight: w
      }));

      const dayAlloc = apportionLargestRemainder(dayItems, exMicroReps);
      exDailyReps.push(dayAlloc.map(a => a.allocated));
    }

    // C. Construir planes diarios con sus zonas de intensidad
    const days: DailyPlan[] = DAYS_ORDER.map((dayName, dIdx) => {
      const dailyExercises: DailyExercisePlan[] = [];
      let dayTotalReps = 0;

      for (let eIdx = 0; eIdx < exerciseNames.length; eIdx++) {
        const ex = exerciseNames[eIdx];
        const repsOnDay = exDailyReps[eIdx][dIdx];
        const refKg = referenceLoads[
          ex === 'Snatch' ? 'snatch' :
          ex === 'Clean & Jerk' ? 'cleanAndJerk' :
          ex === 'Squats' ? 'squats' :
          ex === 'Snatch Pulls' ? 'snatchPulls' : 'cleanPulls'
        ];
        const variantSelection = selectedVariantsByEx[ex];

        // Reparto de las reps del día entre las zonas activas de la variante seleccionada
        const zoneItems: ApportionmentItem<number>[] = Object.entries(variantSelection.distributionPercentages).map(
          ([intStr, pct]) => ({
            key: parseFloat(intStr),
            weight: pct as number
          })
        );

        const zoneAlloc = apportionLargestRemainder(zoneItems, repsOnDay);

        let dayExRepsXInt = 0;
        const prescribedZones: PrescribedZone[] = zoneAlloc.map(za => {
          const intensity = za.key;
          const r = za.allocated;
          const theoKg = (refKg * intensity) / 100;
          const loadKg = roundToNearestKg(theoKg);
          const effectivePct = refKg > 0 ? (loadKg / refKg) * 100 : intensity;

          dayExRepsXInt += r * intensity;
          grandTotalRepsXIntensity += r * intensity;

          return {
            intensityPercent: intensity,
            theoreticalKg: theoKg,
            loadKg,
            effectiveIntensityPercent: effectivePct,
            reps: r
          };
        });

        const dayRealImr = repsOnDay > 0 ? dayExRepsXInt / repsOnDay : variantSelection.targetImr;

        dailyExercises.push({
          exercise: ex,
          reps: repsOnDay,
          referenceKg: refKg,
          variantCode: variantSelection.code,
          zones: prescribedZones,
          realImr: dayRealImr,
          targetImr: variantSelection.targetImr
        });

        dayTotalReps += repsOnDay;
      }

      return {
        day: dayName,
        dayIndex: dIdx,
        totalReps: dayTotalReps,
        exercises: dailyExercises
      };
    });

    // Calcular IMR real del microciclo (ponderado de todas las repeticiones ejecutadas en el micro)
    let microSumRepsXInt = 0;
    let microTotalRepsCount = 0;
    for (const d of days) {
      for (const exPlan of d.exercises) {
        for (const z of exPlan.zones) {
          // Para la IMR global del microciclo se evalúa la intensidad normalizada
          // Para halones, se pondera su intensidad prescrita
          microSumRepsXInt += z.reps * z.intensityPercent;
          microTotalRepsCount += z.reps;
        }
      }
    }

    // Para la IMR metodológica técnica del microciclo (ejercicios clásicos):
    let techRepsXInt = 0;
    let techRepsCount = 0;
    for (const ex of ['Snatch', 'Clean & Jerk', 'Squats'] as ExerciseName[]) {
      const exPlan = microExercises[ex];
      for (const z of exPlan.zones) {
        techRepsXInt += z.reps * z.intensityPercent;
        techRepsCount += z.reps;
      }
    }
    const realMicroImr = techRepsCount > 0 ? techRepsXInt / techRepsCount : targetImr;

    microcycles.push({
      microIndex: mIdx,
      microNumber,
      volumePercent: volPct,
      targetReps: microActualReps,
      actualReps: microActualReps,
      targetImr,
      realImr: parseFloat(realMicroImr.toFixed(2)),
      imrDisplacement: displacement,
      exercises: microExercises,
      days
    });
  }

  // 6. IMR Real del Mesociclo
  let mesoTechRepsXInt = 0;
  let mesoTechRepsCount = 0;
  for (const m of microcycles) {
    for (const ex of ['Snatch', 'Clean & Jerk', 'Squats'] as ExerciseName[]) {
      const exPlan = m.exercises[ex];
      for (const z of exPlan.zones) {
        mesoTechRepsXInt += z.reps * z.intensityPercent;
        mesoTechRepsCount += z.reps;
      }
    }
  }

  const realMesocycleImr = mesoTechRepsCount > 0
    ? parseFloat((mesoTechRepsXInt / mesoTechRepsCount).toFixed(2))
    : input.targetMesocycleImr;

  const planId = `meso_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const planName = input.planName?.trim() || `Mesociclo ${input.durationMicros}M (${input.targetMesocycleImr}% IMR)`;

  const plan: MesocyclePlan = {
    id: planId,
    createdAt: new Date().toISOString(),
    name: planName,
    athleteName: input.athleteName?.trim(),
    input,
    referenceLoads,
    exerciseHierarchy,
    microcycles,
    totalRepsTarget: input.totalReps,
    totalRepsActual: input.totalReps,
    targetImr: input.targetMesocycleImr,
    realImr: realMesocycleImr,
    imrDeviation: parseFloat((realMesocycleImr - input.targetMesocycleImr).toFixed(2)),
    audit: {} as any
  };

  // 7. Auditoría Matemática Automática
  plan.audit = auditMesocyclePlan(plan);

  return plan;
}
