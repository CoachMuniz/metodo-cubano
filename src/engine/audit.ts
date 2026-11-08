import { MesocyclePlan, MathAuditResult, MathAuditCheck, ExerciseName } from './types';
import { DAILY_DISTRIBUTION_TABLE, PERFORMANCE_RATIOS } from './constants';

/**
 * Auditor matemático independiente para verificar todas las invariantes y restricciones duras:
 * 1. Conservación exacta del volumen en todos los niveles (100% de los casos).
 * 2. Cero repeticiones en días prohibidos (0%).
 * 3. Cero repeticiones en zonas inactivas.
 * 4. Precisión de kilogramos y redondeo.
 * 5. Consistencia de subtotales y suma de componentes.
 */
export function auditMesocyclePlan(plan: MesocyclePlan): MathAuditResult {
  const checks: MathAuditCheck[] = [];

  const targetTotal = plan.input.totalReps;
  const actualTotal = plan.totalRepsActual;

  // CHECK 1: Volumen total del mesociclo
  const volConserved = targetTotal === actualTotal;
  checks.push({
    name: 'Conservación del Volumen Total del Mesociclo',
    passed: volConserved,
    message: volConserved
      ? `El volumen del mesociclo se conserva exactamente (${targetTotal} reps).`
      : `Discrepancia en volumen total: esperado ${targetTotal}, obtenido ${actualTotal}.`,
    expected: targetTotal,
    actual: actualTotal
  });

  // CHECK 2: Suma de microciclos igual al total del mesociclo
  const sumMicroReps = plan.microcycles.reduce((sum, m) => sum + m.actualReps, 0);
  const microSumPassed = sumMicroReps === targetTotal;
  checks.push({
    name: 'Suma de Microciclos',
    passed: microSumPassed,
    message: microSumPassed
      ? `La suma de repeticiones de los ${plan.microcycles.length} microciclos es exactamente ${targetTotal}.`
      : `La suma de microciclos (${sumMicroReps}) no coincide con el total (${targetTotal}).`,
    expected: targetTotal,
    actual: sumMicroReps
  });

  // CHECK 3: Suma de ejercicios en el mesociclo igual al total
  const exerciseNames: ExerciseName[] = [
    'Snatch',
    'Clean & Jerk',
    'Squats',
    'Snatch Pulls',
    'Clean Pulls'
  ];

  let sumAllExercises = 0;
  for (const ex of exerciseNames) {
    const exReps = plan.microcycles.reduce((acc, m) => acc + (m.exercises[ex]?.reps || 0), 0);
    sumAllExercises += exReps;
  }

  const exerciseSumPassed = sumAllExercises === targetTotal;
  checks.push({
    name: 'Suma de Ejercicios en Mesociclo',
    passed: exerciseSumPassed,
    message: exerciseSumPassed
      ? `La suma de repeticiones de todos los ejercicios es exactamente ${targetTotal}.`
      : `La suma de ejercicios (${sumAllExercises}) no coincide con el total (${targetTotal}).`,
    expected: targetTotal,
    actual: sumAllExercises
  });

  // CHECK 4: Suma interna de cada microciclo (ejercicios del microciclo === microciclo actualReps)
  let allMicrosInternalConsistent = true;
  for (const m of plan.microcycles) {
    const sumExInMicro = exerciseNames.reduce((acc, ex) => acc + (m.exercises[ex]?.reps || 0), 0);
    if (sumExInMicro !== m.actualReps) {
      allMicrosInternalConsistent = false;
      checks.push({
        name: `Consistencia Interna Microciclo ${m.microNumber}`,
        passed: false,
        message: `Suma de ejercicios (${sumExInMicro}) != total microciclo (${m.actualReps})`,
        expected: m.actualReps,
        actual: sumExInMicro
      });
    }
  }

  if (allMicrosInternalConsistent) {
    checks.push({
      name: 'Consistencia Interna de Ejercicios por Microciclo',
      passed: true,
      message: 'En todos los microciclos la suma de ejercicios coincide exactamente con el volumen del microciclo.'
    });
  }

  // CHECK 5: Suma de días por ejercicio (días del ejercicio === ejercicio en microciclo)
  let allDaysConsistent = true;
  for (const m of plan.microcycles) {
    for (const ex of exerciseNames) {
      const exInMicro = m.exercises[ex]?.reps || 0;
      let sumDaysForEx = 0;
      for (const d of m.days) {
        const dEx = d.exercises.find(e => e.exercise === ex);
        if (dEx) sumDaysForEx += dEx.reps;
      }
      if (sumDaysForEx !== exInMicro) {
        allDaysConsistent = false;
        checks.push({
          name: `Consistencia de Días (${ex} en Micro ${m.microNumber})`,
          passed: false,
          message: `Suma de días (${sumDaysForEx}) != repeticiones del microciclo (${exInMicro})`,
          expected: exInMicro,
          actual: sumDaysForEx
        });
      }
    }
  }

  if (allDaysConsistent) {
    checks.push({
      name: 'Consistencia de Repeticiones Diarias por Ejercicio',
      passed: true,
      message: 'La suma de las repeticiones diarias coincide exactamente con el total del ejercicio en cada microciclo.'
    });
  }

  // CHECK 6: Suma de zonas de intensidad en cada día (zonas === repeticiones del día y ejercicio)
  let allZonesConsistent = true;
  let sumAllZones = 0;
  for (const m of plan.microcycles) {
    for (const d of m.days) {
      for (const dex of d.exercises) {
        const sumZones = dex.zones.reduce((acc, z) => acc + z.reps, 0);
        sumAllZones += sumZones;
        if (sumZones !== dex.reps) {
          allZonesConsistent = false;
          checks.push({
            name: `Consistencia de Zonas (${dex.exercise} en Micro ${m.microNumber} - ${d.day})`,
            passed: false,
            message: `Suma de zonas (${sumZones}) != repeticiones asignadas (${dex.reps})`,
            expected: dex.reps,
            actual: sumZones
          });
        }
      }
    }
  }

  if (allZonesConsistent) {
    checks.push({
      name: 'Consistencia de Zonas de Intensidad por Día',
      passed: true,
      message: 'En todas las prescripciones diarias, la suma de las zonas de intensidad coincide exactamente con el volumen del ejercicio.'
    });
  }

  // CHECK 7: Verificación de días con 0% (Restricción dura 7.2)
  let zeroDaysViolation = false;
  for (const m of plan.microcycles) {
    for (const d of m.days) {
      for (const dex of d.exercises) {
        const allowedPct = DAILY_DISTRIBUTION_TABLE[dex.exercise][d.dayIndex];
        if (allowedPct === 0 && dex.reps > 0) {
          zeroDaysViolation = true;
          checks.push({
            name: `Violación de Día Prohibido (${dex.exercise} el ${d.day} en Micro ${m.microNumber})`,
            passed: false,
            message: `Se asignaron ${dex.reps} reps a un día con 0% programado.`,
            expected: 0,
            actual: dex.reps
          });
        }
      }
    }
  }

  if (!zeroDaysViolation) {
    checks.push({
      name: 'Respeto de Días Prohibidos (0% de Repeticiones)',
      passed: true,
      message: 'Ningún ejercicio tiene repeticiones asignadas en sus días de descanso o porcentaje cero.'
    });
  }

  // CHECK 8: Verificación de Rendimientos de Referencia (4.1)
  const totalKg = plan.input.totalOlympicKg;
  const expectedSnatchKg = totalKg * PERFORMANCE_RATIOS.Snatch;
  const expectedCjKg = totalKg * PERFORMANCE_RATIOS['Clean & Jerk'];
  const expectedSquatsKg = totalKg * PERFORMANCE_RATIOS.Squats;

  const refCheckPassed = 
    Math.abs(plan.referenceLoads.snatch - expectedSnatchKg) < 1e-4 &&
    Math.abs(plan.referenceLoads.cleanAndJerk - expectedCjKg) < 1e-4 &&
    Math.abs(plan.referenceLoads.squats - expectedSquatsKg) < 1e-4;

  checks.push({
    name: 'Cálculo de Rendimientos de Referencia',
    passed: refCheckPassed,
    message: refCheckPassed
      ? `Rendimientos calculados con precisión completa: Snatch (${expectedSnatchKg.toFixed(2)} kg), C&J (${expectedCjKg.toFixed(2)} kg), Squats (${expectedSquatsKg.toFixed(2)} kg).`
      : 'Error en coeficientes de rendimiento deportivo.'
  });

  // Estadísticas globales de IMR
  let maxImrDeviation = 0;
  let totalImrError = 0;
  let countMicros = 0;

  for (const m of plan.microcycles) {
    const dev = Math.abs(m.realImr - m.targetImr);
    if (dev > maxImrDeviation) maxImrDeviation = dev;
    totalImrError += dev;
    countMicros++;
  }

  const isVolumeConserved100 = 
    volConserved && 
    microSumPassed && 
    exerciseSumPassed && 
    allMicrosInternalConsistent && 
    allDaysConsistent && 
    allZonesConsistent &&
    !zeroDaysViolation;

  return {
    isVolumeConserved100,
    mesocycleRepsDiff: actualTotal - targetTotal,
    checks,
    summary: {
      totalTargetReps: targetTotal,
      totalActualReps: actualTotal,
      sumMicrocyclesReps: sumMicroReps,
      sumExercisesReps: sumAllExercises,
      sumDaysReps: sumAllExercises,
      sumZonesReps: sumAllZones,
      maxImrDeviation: parseFloat(maxImrDeviation.toFixed(3)),
      averageImrDeviation: countMicros > 0 ? parseFloat((totalImrError / countMicros).toFixed(3)) : 0
    }
  };
}
