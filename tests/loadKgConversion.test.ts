import { describe, it, expect } from 'vitest';
import { roundToNearestKg } from '../src/engine/apportionment';
import { calculateMesocycle } from '../src/engine/calculator';
import { PERFORMANCE_RATIOS } from '../src/engine/constants';

describe('Conversión de Cargas a Kilogramos y Rendimientos de Referencia', () => {
  it('Debe aplicar la regla 10.2: redondear al entero más cercano y .5 hacia arriba', () => {
    expect(roundToNearestKg(74.4)).toBe(74);
    expect(roundToNearestKg(74.5)).toBe(75);
    expect(roundToNearestKg(74.6)).toBe(75);
    expect(roundToNearestKg(100.0)).toBe(100);
    expect(roundToNearestKg(99.49)).toBe(99);
    expect(roundToNearestKg(99.50)).toBe(100);
  });

  it('Debe calcular rendimientos de referencia exactos según Total Olímpico', () => {
    const totalOlympic = 226; // Caso de referencia Meso 4 micro.xlsx
    const plan = calculateMesocycle({
      totalOlympicKg: totalOlympic,
      totalReps: 1250,
      ptPercent: 57,
      snatchInPtPercent: 51,
      squatsInPfPercent: 55,
      snatchPullsInPullsPercent: 55,
      durationMicros: 4,
      selectedAlternativeIndex: 2, // Alternativa 3 (-2, -1, +1, +3)
      targetMesocycleImr: 67
    });

    // Snatch = 226 * 0.43 = 97.18
    expect(plan.referenceLoads.snatch).toBeCloseTo(226 * PERFORMANCE_RATIOS.Snatch, 4);
    // Clean & Jerk = 226 * 0.57 = 128.82
    expect(plan.referenceLoads.cleanAndJerk).toBeCloseTo(226 * PERFORMANCE_RATIOS['Clean & Jerk'], 4);
    // Squats = 226 * 0.732 = 165.432
    expect(plan.referenceLoads.squats).toBeCloseTo(226 * PERFORMANCE_RATIOS.Squats, 4);
    // Snatch Pulls = Snatch
    expect(plan.referenceLoads.snatchPulls).toBeCloseTo(plan.referenceLoads.snatch, 4);
    // Clean Pulls = Clean & Jerk
    expect(plan.referenceLoads.cleanPulls).toBeCloseTo(plan.referenceLoads.cleanAndJerk, 4);
  });
});
