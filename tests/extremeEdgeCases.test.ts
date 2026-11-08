import { describe, it, expect } from 'vitest';
import { calculateMesocycle } from '../src/engine/calculator';
import { DurationOption, UserInputData } from '../src/engine/types';
import { MICROCYCLE_ALTERNATIVES } from '../src/engine/constants';

describe('Pruebas de Casos Extremos y Propiedades Matemáticas (16.4 y 16.5)', () => {
  it('Debe soportar volúmenes pequeños (e.g. 60 repeticiones) conservando el volumen al 100%', () => {
    const plan = calculateMesocycle({
      totalOlympicKg: 150,
      totalReps: 60,
      ptPercent: 55,
      snatchInPtPercent: 50,
      squatsInPfPercent: 50,
      snatchPullsInPullsPercent: 50,
      durationMicros: 3,
      selectedAlternativeIndex: 0,
      targetMesocycleImr: 65
    });

    expect(plan.totalRepsActual).toBe(60);
    expect(plan.audit.isVolumeConserved100).toBe(true);
  });

  it('Debe soportar volúmenes grandes (e.g. 4500 repeticiones) conservando el volumen al 100%', () => {
    const plan = calculateMesocycle({
      totalOlympicKg: 300,
      totalReps: 4500,
      ptPercent: 60,
      snatchInPtPercent: 52,
      squatsInPfPercent: 55,
      snatchPullsInPullsPercent: 48,
      durationMicros: 5,
      selectedAlternativeIndex: 1,
      targetMesocycleImr: 72
    });

    expect(plan.totalRepsActual).toBe(4500);
    expect(plan.audit.isVolumeConserved100).toBe(true);
  });

  it('Debe manejar porcentajes extremos cercanos a límites (PT = 1%, Snatch = 99%)', () => {
    const plan = calculateMesocycle({
      totalOlympicKg: 200,
      totalReps: 1000,
      ptPercent: 1,
      snatchInPtPercent: 99,
      squatsInPfPercent: 1,
      snatchPullsInPullsPercent: 99,
      durationMicros: 4,
      selectedAlternativeIndex: 0,
      targetMesocycleImr: 60
    });

    expect(plan.totalRepsActual).toBe(1000);
    expect(plan.audit.isVolumeConserved100).toBe(true);
  });

  it('Debe validar todas las alternativas de todas las duraciones (2, 3, 4, 5 micros)', () => {
    const durations: DurationOption[] = [2, 3, 4, 5];
    for (const d of durations) {
      const alts = MICROCYCLE_ALTERNATIVES[d];
      for (let i = 0; i < alts.length; i++) {
        const plan = calculateMesocycle({
          totalOlympicKg: 220,
          totalReps: 1200,
          ptPercent: 55,
          snatchInPtPercent: 50,
          squatsInPfPercent: 50,
          snatchPullsInPullsPercent: 50,
          durationMicros: d,
          selectedAlternativeIndex: i,
          targetMesocycleImr: 68
        });

        expect(plan.microcycles.length).toBe(d);
        expect(plan.totalRepsActual).toBe(1200);
        expect(plan.audit.isVolumeConserved100).toBe(true);
      }
    }
  });

  it('Debe rechazar entradas inválidas con mensajes claros', () => {
    expect(() => calculateMesocycle({
      totalOlympicKg: 0,
      totalReps: 1000,
      ptPercent: 50,
      snatchInPtPercent: 50,
      squatsInPfPercent: 50,
      snatchPullsInPullsPercent: 50,
      durationMicros: 4,
      selectedAlternativeIndex: 0,
      targetMesocycleImr: 67
    })).toThrowError(/Total Olímpico/);

    expect(() => calculateMesocycle({
      totalOlympicKg: 200,
      totalReps: -50,
      ptPercent: 50,
      snatchInPtPercent: 50,
      squatsInPfPercent: 50,
      snatchPullsInPullsPercent: 50,
      durationMicros: 4,
      selectedAlternativeIndex: 0,
      targetMesocycleImr: 67
    })).toThrowError(/volumen/);

    expect(() => calculateMesocycle({
      totalOlympicKg: 200,
      totalReps: 1000,
      ptPercent: 120, // >100
      snatchInPtPercent: 50,
      squatsInPfPercent: 50,
      snatchPullsInPullsPercent: 50,
      durationMicros: 4,
      selectedAlternativeIndex: 0,
      targetMesocycleImr: 67
    })).toThrowError(/Preparación Técnica/);
  });
});
