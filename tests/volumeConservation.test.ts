import { describe, it, expect } from 'vitest';
import { calculateMesocycle } from '../src/engine/calculator';
import { DurationOption, UserInputData } from '../src/engine/types';

describe('Matriz de Conservación del Volumen al 100%', () => {
  const durations: DurationOption[] = [2, 3, 4, 5];
  const testVolumes = [350, 850, 1250, 1600, 2200];
  const testPtPfs = [
    { pt: 50, snatchInPt: 50, squatsInPf: 50, pullsInPulls: 50 },
    { pt: 57, snatchInPt: 51, squatsInPf: 55, pullsInPulls: 55 },
    { pt: 62, snatchInPt: 52, squatsInPf: 60, pullsInPulls: 45 },
    { pt: 70, snatchInPt: 48, squatsInPf: 45, pullsInPulls: 50 },
  ];

  for (const duration of durations) {
    for (const totalReps of testVolumes) {
      for (const [splitIdx, split] of testPtPfs.entries()) {
        it(`Debe conservar 100% volumen para ${duration} micros, ${totalReps} reps, split ${splitIdx + 1}`, () => {
          const input: UserInputData = {
            totalOlympicKg: 200,
            totalReps,
            ptPercent: split.pt,
            snatchInPtPercent: split.snatchInPt,
            squatsInPfPercent: split.squatsInPf,
            snatchPullsInPullsPercent: split.pullsInPulls,
            durationMicros: duration,
            selectedAlternativeIndex: 0,
            targetMesocycleImr: 67
          };

          const plan = calculateMesocycle(input);

          // 1. Conservación de total mesociclo
          expect(plan.totalRepsActual).toBe(totalReps);

          // 2. Suma de microciclos
          const sumMicros = plan.microcycles.reduce((acc, m) => acc + m.actualReps, 0);
          expect(sumMicros).toBe(totalReps);

          // 3. Suma de días en cada microciclo
          for (const m of plan.microcycles) {
            const sumDays = m.days.reduce((acc, d) => acc + d.totalReps, 0);
            expect(sumDays).toBe(m.actualReps);

            // 4. Suma de ejercicios en el día
            for (const d of m.days) {
              const sumDayExercises = d.exercises.reduce((acc, e) => acc + e.reps, 0);
              expect(sumDayExercises).toBe(d.totalReps);

              // 5. Suma de zonas de intensidad en el ejercicio diario
              for (const e of d.exercises) {
                const sumZones = e.zones.reduce((acc, z) => acc + z.reps, 0);
                expect(sumZones).toBe(e.reps);
              }
            }
          }

          // 6. Auditoría formal 100% aprobada
          expect(plan.audit.isVolumeConserved100).toBe(true);
        });
      }
    }
  }
});
