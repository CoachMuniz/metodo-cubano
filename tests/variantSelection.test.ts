import { describe, it, expect } from 'vitest';
import { selectOptimalVariant } from '../src/engine/variantSelector';

describe('Selección Automática de Variantes A/B/C', () => {
  it('Debe seleccionar variante determinista minimizando el error de IMR', () => {
    // Para Arranque con IMR objetivo 67 y 100 repeticiones con ref 100kg
    const res = selectOptimalVariant('Snatch', 100, 67, 100);
    expect(res.code).toMatch(/^67[abc]$/);
    expect(res.zones.reduce((a, b) => a + b.reps, 0)).toBe(100);
    // Real IMR debe ser muy cercano a 67
    expect(Math.abs(res.realImr - 67)).toBeLessThanOrEqual(1.0);
  });

  it('Debe seleccionar variante de halones usando la tabla específica de halones', () => {
    // Halones con IMR 88
    const res = selectOptimalVariant('Snatch Pulls', 80, 88, 100);
    expect(res.code).toMatch(/^88[abc]$/);
    expect(res.zones.reduce((a, b) => a + b.reps, 0)).toBe(80);
    // Verificar que las intensidades corresponden a la tabla de halones (70 a 115)
    const intensities = res.zones.filter(z => z.reps > 0).map(z => z.intensityPercent);
    for (const int of intensities) {
      expect(int).toBeGreaterThanOrEqual(70);
      expect(int).toBeLessThanOrEqual(115);
    }
  });

  it('Debe manejar 0 repeticiones sin errores', () => {
    const res = selectOptimalVariant('Squats', 0, 70, 150);
    expect(res.zones.reduce((a, b) => a + b.reps, 0)).toBe(0);
    expect(res.imrError).toBe(0);
  });
});
