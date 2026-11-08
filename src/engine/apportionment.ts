/**
 * MOTOR MATEMÁTICO DE OPTIMIZACIÓN Y REPARTO ENTERO (LARGEST REMAINDER METHOD)
 * 
 * Implementa el método Hamilton / Hare-Niemeyer (Cuota Mayor) y optimización biproporcional
 * para garantizar 100% de conservación del volumen en todas las dimensiones:
 * mesociclo -> microciclos -> ejercicios -> días -> zonas de intensidad.
 */

export interface ApportionmentItem<T = string> {
  key: T;
  weight: number;
}

export interface ApportionmentResult<T = string> {
  key: T;
  weight: number;
  exactTarget: number;
  allocated: number;
  remainder: number;
}

/**
 * Reparto entero unidimensional mediante el método de los mayores restos (Hamilton / Hare-Niemeyer).
 * Garantiza:
 * 1. sum(allocated) === targetTotal EXACTAMENTE.
 * 2. allocated >= 0 y enteros.
 * 3. Si weight === 0, allocated === 0 siempre.
 * 4. Desempate determinista por peso descendente e índice.
 */
export function apportionLargestRemainder<T = string>(
  items: ApportionmentItem<T>[],
  targetTotal: number
): ApportionmentResult<T>[] {
  if (targetTotal <= 0) {
    return items.map(item => ({
      key: item.key,
      weight: item.weight,
      exactTarget: 0,
      allocated: 0,
      remainder: 0
    }));
  }

  const totalWeight = items.reduce((sum, it) => sum + it.weight, 0);
  if (totalWeight <= 0) {
    // Si todos los pesos son 0, no hay asignación válida
    return items.map(item => ({
      key: item.key,
      weight: item.weight,
      exactTarget: 0,
      allocated: 0,
      remainder: 0
    }));
  }

  // Paso 1: Cuotas exactas y bases enteras
  const calculated = items.map((item, index) => {
    if (item.weight <= 0) {
      return {
        key: item.key,
        weight: 0,
        exactTarget: 0,
        base: 0,
        remainder: 0,
        index
      };
    }
    const exactTarget = (item.weight / totalWeight) * targetTotal;
    const base = Math.floor(exactTarget);
    const remainder = exactTarget - base;
    return {
      key: item.key,
      weight: item.weight,
      exactTarget,
      base,
      remainder,
      index
    };
  });

  const sumBase = calculated.reduce((sum, it) => sum + it.base, 0);
  let deficit = targetTotal - sumBase;

  // Paso 2: Ordenar candidatos a recibir el +1 por mayor resto.
  // Filtro duro: los que tienen peso 0 jamás reciben repeticiones.
  const candidates = calculated
    .filter(it => it.weight > 0)
    .sort((a, b) => {
      // 1. Mayor resto
      const diffRem = b.remainder - a.remainder;
      if (Math.abs(diffRem) > 1e-9) return diffRem;
      // 2. Mayor peso original (desempate metodológico)
      const diffWeight = b.weight - a.weight;
      if (Math.abs(diffWeight) > 1e-9) return diffWeight;
      // 3. Índice original determinista
      return a.index - b.index;
    });

  const additionalIndices = new Set<number>();
  for (let i = 0; i < deficit && i < candidates.length; i++) {
    additionalIndices.add(candidates[i].index);
  }

  // Paso 3: Asignar resultado final
  return calculated.map(it => ({
    key: it.key,
    weight: it.weight,
    exactTarget: it.exactTarget,
    allocated: it.base + (additionalIndices.has(it.index) ? 1 : 0),
    remainder: it.remainder
  }));
}

/**
 * Matriz de Reparto Biproporcional (Filas: Ejercicios, Columnas: Microciclos).
 * Garantiza que:
 * 1. Para cada ejercicio i: sum_j M[i][j] === rowTotals[i]
 * 2. Para cada microciclo j: sum_i M[i][j] === colTotals[j]
 * 3. sum_ij M[i][j] === targetTotal
 */
export function biproportionalApportionment(
  rowKeys: string[],
  colKeys: string[],
  rowTotals: number[], // repeticiones por ejercicio
  colTotals: number[], // repeticiones por microciclo
  idealWeights: number[][] // rowKeys.length x colKeys.length (p_i * w_j)
): number[][] {
  const numRows = rowKeys.length;
  const numCols = colKeys.length;

  const totalR = rowTotals.reduce((a, b) => a + b, 0);
  const totalC = colTotals.reduce((a, b) => a + b, 0);
  if (totalR !== totalC) {
    throw new Error(`Inconsistencia en totales de biproporcionalidad: Filas=${totalR}, Columnas=${totalC}`);
  }

  // Inicializar matriz de cuotas ideales continuas
  const matrix: number[][] = Array.from({ length: numRows }, () => new Array(numCols).fill(0));
  const baseMatrix: number[][] = Array.from({ length: numRows }, () => new Array(numCols).fill(0));
  const remainderMatrix: { r: number; c: number; rem: number; weight: number }[] = [];

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const ideal = (rowTotals[r] * colTotals[c]) / totalR;
      const base = Math.floor(ideal);
      baseMatrix[r][c] = base;
      matrix[r][c] = base;
      remainderMatrix.push({
        r,
        c,
        rem: ideal - base,
        weight: idealWeights[r]?.[c] ?? ideal
      });
    }
  }

  // Ajuste biproporcional de residuos respetando restricciones marginales exactas
  // Calculamos los déficits en filas y columnas
  const curRowSums = matrix.map(row => row.reduce((a, b) => a + b, 0));
  const curColSums = new Array(numCols).fill(0);
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      curColSums[c] += matrix[r][c];
    }
  }

  const rowDeficits = rowTotals.map((tot, r) => tot - curRowSums[r]);
  const colDeficits = colTotals.map((tot, c) => tot - curColSums[c]);

  // Ordenar celdas por mayor resto y mayor peso
  remainderMatrix.sort((a, b) => {
    const diffRem = b.rem - a.rem;
    if (Math.abs(diffRem) > 1e-9) return diffRem;
    return b.weight - a.weight;
  });

  // Asignar unidades mientras se respetan tanto rowDeficits como colDeficits
  for (const item of remainderMatrix) {
    if (rowDeficits[item.r] > 0 && colDeficits[item.c] > 0) {
      matrix[item.r][item.c] += 1;
      rowDeficits[item.r] -= 1;
      colDeficits[item.c] -= 1;
    }
  }

  // Si quedan residuos debido a acoplamientos enteros, redistribuir mediante transporte determinista
  for (let r = 0; r < numRows; r++) {
    while (rowDeficits[r] > 0) {
      // Buscar la columna con mayor déficit (o buscar reajuste de ciclo)
      let bestC = -1;
      let maxColDef = -Infinity;
      for (let c = 0; c < numCols; c++) {
        if (colDeficits[c] > maxColDef) {
          maxColDef = colDeficits[c];
          bestC = c;
        }
      }
      if (bestC !== -1 && colDeficits[bestC] > 0) {
        matrix[r][bestC] += 1;
        rowDeficits[r] -= 1;
        colDeficits[bestC] -= 1;
      } else {
        // Encontrar columna c donde podamos transferir
        for (let c = 0; c < numCols; c++) {
          if (matrix[r][c] >= 0) {
            // Rebalanceo cruzado
            for (let r2 = 0; r2 < numRows; r2++) {
              if (rowDeficits[r2] < 0 && matrix[r2][c] > 0) {
                matrix[r2][c] -= 1;
                matrix[r][c] += 1;
                rowDeficits[r2] += 1;
                rowDeficits[r] -= 1;
                break;
              }
            }
          }
          if (rowDeficits[r] === 0) break;
        }
        break;
      }
    }
  }

  return matrix;
}

/**
 * Conversión de porcentaje de intensidad a kilogramos según regla 10.2:
 * "Redondear al kilogramo entero más cercano. En valores exactamente terminados en 0,5 kg, redondear hacia arriba."
 * Ejemplos:
 * 74.4 kg -> 74 kg
 * 74.5 kg -> 75 kg
 * 74.6 kg -> 75 kg
 */
export function roundToNearestKg(val: number): number {
  return Math.floor(val + 0.5);
}
