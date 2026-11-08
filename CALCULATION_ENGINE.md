# Motor de Cálculo y Optimización Combinatoria (Calculation Engine)

Este documento detalla la arquitectura algorítmica, los fundamentos matemáticos y los métodos de optimización discreta implementados en el núcleo de cálculo del sistema (`src/engine/`).

---

## 1. El Problema del Reparto Discreto de Repeticiones

En la planificación del entrenamiento, el volumen se expresa en **repeticiones enteras** ($\mathbb{Z}^+$). Sin embargo, los porcentajes metodológicos teóricos (PT/PF, ejercicios, microciclos, días y zonas de intensidad) arrojan casi invariablemente valores con fracciones decimales.

### La Falla del Modelo Excel Tradicional
En las planillas de cálculo históricas (p. ej., `Meso 4 micro.xlsx` o `Meso 5 micro1.xlsx`), las celdas individuales aplican la función `REDONDEAR(celda, 0)` de forma aislada e independiente. Esto produce dos graves patologías matemáticas:
1. **Fuga o Exceso de Volumen**: La suma de las celdas redondeadas no coincide con el total asignado ($\sum \text{redondeo}(x_i) \neq \text{Total}$). En mesociclos típicos de 1200 repeticiones, esto genera discrepancias de entre $-15$ y $+25$ repeticiones.
2. **Asimetría Acumulativa**: Los microciclos o días finales absorben errores de redondeo forzados como "celdas de ajuste", distorsionando la intensidad media relativa real.

---

## 2. Solución Algorítmica: Método del Resto Mayor (Hamilton / Hare-Niemeyer)

Para cualquier distribución unidimensional de un total entero $V$ sobre un vector de porcentajes teóricos $P = (p_1, p_2, \dots, p_n)$ tal que $\sum_{i=1}^n p_i = 100\%$, el motor implementa el **Método del Resto Mayor**:

```typescript
// Implementación conceptual (src/engine/apportionment.ts)
export function apportionLargestRemainder(
  total: number,
  percentages: number[]
): number[] {
  // 1. Asignación de cuotas base enteras (piso)
  const quotas = percentages.map(p => (total * p) / 100);
  const floors = quotas.map(q => Math.floor(q));
  
  // 2. Cálculo del remanente por repartir
  const assigned = floors.reduce((a, b) => a + b, 0);
  let remainder = total - assigned;

  // 3. Ordenamiento por parte decimal decreciente
  const fractions = quotas.map((q, idx) => ({
    index: idx,
    fraction: q - floors[idx]
  })).sort((a, b) => b.fraction - a.fraction || a.index - b.index);

  // 4. Distribución de 1 repetición adicional a las mayores fracciones
  const result = [...floors];
  for (let i = 0; i < remainder; i++) {
    result[fractions[i].index]++;
  }
  return result;
}
```

### Propiedades Matemáticas Garantizadas:
1. **Conservación Estricta**: $\sum_{i=1}^n \text{result}[i] = V$ con exactitud de máquina.
2. **Acotamiento del Error**: $|\text{result}[i] - \text{cuota}_i| < 1$, garantizando que ninguna celda se desvíe más de una repetición de su valor ideal continuo.
3. **Determinismo y Reproducibilidad**: Desempate por índice original ($a.index - b.index$).

---

## 3. Reparto Biproporcional Matricial Bidimensional (2D)

La distribución diaria de los ejercicios (matriz de 5 ejercicios $\times$ 6 días) y la distribución por microciclos (matriz de 5 ejercicios $\times$ $M$ microciclos) constituyen problemas de **reparto matricial bidimensional**, donde deben cumplirse simultáneamente dos restricciones marginales:
- La suma de cada fila $r$ debe ser exactamente igual al total del ejercicio $E_r$.
- La suma de cada columna $c$ debe ser exactamente igual al total del día $D_c$ o del microciclo $M_c$.
- **Restricción de Cero Absoluto**: Si la matriz teórica tiene $p_{r,c} = 0$, la celda resultante **debe ser idénticamente 0** ($x_{r,c} = 0$).

### Algoritmo Biproporcional con Restricción de Ceros (`apportion2DMatrix`):
1. **Inicialización**: Se calculan las cuotas teóricas $Q_{r,c} = \text{Total} \times P_{r,c} / 100$. Se asigna la base entera $X_{r,c} = \lfloor Q_{r,c} \rfloor$.
2. **Preservación de Ceros**: Si $P_{r,c} = 0$, se fija $X_{r,c} = 0$ y su fracción asociada se neutraliza a $-\infty$ para impedir que absorba cualquier resto.
3. **Ajuste de Filas**: Se ajustan las filas mediante Hamilton para satisfacer los totales marginales de cada ejercicio.
4. **Optimización de Desviación Biproyeccional**: Se intercambian unidades entre celdas con $P_{r,c} > 0$ minimizando la distancia cuadrática a las cuotas ideales:
   $$\min \sum_{r,c} (X_{r,c} - Q_{r,c})^2 \quad \text{sujeto a} \quad \sum_c X_{r,c} = E_r, \ \sum_r X_{r,c} = D_c, \ X_{r,c} \in \mathbb{Z}_{\ge 0}$$

---

## 4. Selección Algorítmica de Variantes A, B y C

En cada microciclo $m$ y para cada ejercicio $e$, se dispone de un volumen objetivo de repeticiones $R_{e,m}$ y una IMR teórica:
$$\text{IMR}_{\text{teórica}} = \text{IMR}_{\text{mesociclo}} + \Delta \text{IMR}_m$$

Para los Pulls, se aplica además el desplazamiento normativo:
$$\text{IMR}_{\text{pulls}} = \text{IMR}_{\text{teórica}} + 21$$

### Procedimiento de Evaluación:
1. Se recuperan de la base de datos las tres tablas candidatas:
   - Variante A: $T_A = [p_1^A, p_2^A, \dots, p_9^A]$
   - Variante B: $T_B = [p_1^B, p_2^B, \dots, p_9^B]$
   - Variante C: $T_C = [p_1^C, p_2^C, \dots, p_9^C]$
2. Para cada variante $v \in \{A, B, C\}$:
   a. Se reparten las $R_{e,m}$ repeticiones en las 9 zonas de intensidad utilizando el método de Hamilton:
      $$[r_{1}^v, r_{2}^v, \dots, r_{9}^v] = \text{apportionLargestRemainder}(R_{e,m}, T_v)$$
   b. Se calcula la **IMR real alcanzada** por esa distribución entera:
      $$\text{IMR}_{\text{real}}(v) = \frac{\sum_{z=1}^9 (r_z^v \times \text{zona}_z)}{\sum_{z=1}^9 r_z^v}$$
   c. Se calcula el error absoluto respecto a la IMR teórica:
      $$\epsilon(v) = \left| \text{IMR}_{\text{real}}(v) - \text{IMR}_{\text{teórica}} \right|$$
3. Se selecciona la variante óptima que minimiza $\epsilon(v)$. En caso de empate ($\epsilon(v_1) = \epsilon(v_2)$), se adopta la regla de prioridad determinista: $A \succ B \succ C$.

---

## 5. Cálculo de Cargas en Kilogramos y Redondeo

A partir de los rendimientos de referencia calculados sobre el Total Olímpico ($TO$), la carga teórica en kilogramos para una zona de intensidad $z$ se obtiene como:
$$\text{Carga}_{\text{teórica}}(e, z) = \text{Rendimiento}(e) \times \frac{z}{100}$$

La carga prescrita en sala se redondea a kilogramos enteros según la norma de redondeo simétrico a la mitad superior ($0.5 \uparrow$):
$$\text{Carga}_{\text{prescrita}} = \lfloor \text{Carga}_{\text{teórica}} + 0.5 \rfloor$$

### Precisión Intermedia
Todas las operaciones internas (porcentajes de microciclos, IMR ponderadas, cuotas flotantes) se mantienen en punto flotante de doble precisión (`IEEE 754 float64`). El redondeo a entero ocurre **exclusivamente** en el paso final de prescripción de repeticiones o kilogramos.
