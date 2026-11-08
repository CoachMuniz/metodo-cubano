import { describe, it, expect } from 'vitest';
import { calculateMesocycle } from '../src/engine/calculator';
import { DAILY_DISTRIBUTION_TABLE } from '../src/engine/constants';

describe('Comparación de Caso de Referencia contra Excel Original', () => {
  it('Debe calcular el caso representativo de la ESFAAR (226 kg, 1250 reps, 57% PT, IMR 67)', () => {
    const plan = calculateMesocycle({
      totalOlympicKg: 226,
      totalReps: 1250,
      ptPercent: 57,
      snatchInPtPercent: 51,
      squatsInPfPercent: 55,
      snatchPullsInPullsPercent: 55,
      durationMicros: 4,
      selectedAlternativeIndex: 2, // 30, 26, 24, 20 (-2, -1, +1, +3)
      targetMesocycleImr: 67,
      planName: 'Plan de Referencia ESFAAR',
      athleteName: 'Atleta de Referencia'
    });

    // 1. Conservación de volumen total
    expect(plan.totalRepsActual).toBe(1250);

    // 2. Microciclos tienen 4
    expect(plan.microcycles.length).toBe(4);

    // 3. Desplazamientos metodológicos de IMR
    expect(plan.microcycles[0].targetImr).toBe(65);
    expect(plan.microcycles[1].targetImr).toBe(66);
    expect(plan.microcycles[2].targetImr).toBe(68);
    expect(plan.microcycles[3].targetImr).toBe(70);

    // 4. Verificación de días prohibidos
    for (const m of plan.microcycles) {
      for (const d of m.days) {
        for (const ex of d.exercises) {
          const allowedPct = DAILY_DISTRIBUTION_TABLE[ex.exercise][d.dayIndex];
          if (allowedPct === 0) {
            expect(ex.reps).toBe(0);
          }
        }
      }
    }

    // 5. Cargas en kg no negativas
    for (const m of plan.microcycles) {
      for (const d of m.days) {
        for (const ex of d.exercises) {
          for (const z of ex.zones) {
            expect(z.loadKg).toBeGreaterThanOrEqual(0);
            expect(Number.isInteger(z.loadKg)).toBe(true);
          }
        }
      }
    }

    // 6. Auditoría 100% aprobada
    expect(plan.audit.isVolumeConserved100).toBe(true);
    expect(plan.audit.mesocycleRepsDiff).toBe(0);
  });
});
