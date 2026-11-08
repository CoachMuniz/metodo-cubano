# Política de Redondeo y Optimización Discreta (Rounding Policy)

Este documento formaliza la política de redondeo, conservación de volumen y tratamiento numérico adoptada en la aplicación para erradicar las discrepancias habituales de las planillas de cálculo.

---

## 1. Principio Fundamental: Prohibición de Redondeos Celda a Celda

En las hojas de cálculo convencionales, cada celda de repeticiones contiene una fórmula del tipo:
```excel
=REDONDEAR(Total * Porcentaje, 0)
```
Dado que la función de redondeo ordinaria no posee memoria del conjunto ni de las restricciones marginales, la suma de las partes redondeadas casi nunca equivale al total del todo:
$$\sum_{i=1}^n \text{round}(x_i) \neq \text{round}\left(\sum_{i=1}^n x_i\right)$$

**Regla de Oro del Sistema**:
> Queda estrictamente prohibido aplicar redondeos independientes a celdas aisladas. Toda conversión de cuotas continuas a repeticiones discretas debe procesarse mediante algoritmos de reparto proporcional que satisfagan exactamente las restricciones de suma prefijadas.

---

## 2. Política de Redondeo para Repeticiones: Método del Resto Mayor

Para cualquier vector de cuotas continuas $Q = (q_1, q_2, \dots, q_n)$ que deba sumar un total entero $V$:

1. **Parte Entera Garantizada (Cuota Inferior)**:
   Se asigna a cada elemento $i$ su valor piso entero:
   $$x_i = \lfloor q_i \rfloor$$
2. **Cálculo del Déficit**:
   $$D = V - \sum_{i=1}^n x_i$$
   Por definición matemática, $0 \le D < n$.
3. **Distribución del Déficit por Fracción Decreciente**:
   Se calculan las fracciones decimales $f_i = q_i - \lfloor q_i \rfloor$.
   Se ordenan los índices de mayor a menor valor de $f_i$.
   Los primeros $D$ elementos reciben $+1$ repetición:
   $$x_i \leftarrow x_i + 1 \quad \forall i \in \text{Top}_D(f)$$
4. **Criterio de Desempate**:
   Si dos elementos poseen exactamente la misma fracción decimal ($f_j = f_k$), el desempate se resuelve de forma determinista mediante el orden de aparición de los ejercicios (Snatch $\to$ Clean & Jerk $\to$ Squats $\to$ Snatch Pulls $\to$ Clean Pulls) o de los días de la semana (Lunes $\to$ Sábado).

---

## 3. Política de Preservación de Celdas Nulas (Zero-Leakage Policy)

En la matriz de distribución diaria fija (Sección 7 del método cubano), varios pares (ejercicio, día) tienen un porcentaje metodológico de exactamente $0\%$:
- **Clean & Jerk los Sábados**: $0\%$.
- **Snatch Pulls los Lunes, Miércoles, Viernes y Sábados**: $0\%$.
- **Clean Pulls los Martes, Miércoles, Jueves y Sábados**: $0\%$.

### Regla Inviolable:
Bajo ninguna circunstancia matemática un algoritmo de reparto o ajuste de restos puede asignar una repetición a una celda con porcentaje nominal igual a $0\%$.

Para implementar esto:
- Las cuotas con porcentaje $0$ se excluyen de la lista de candidatos para la absorción de restos decimales ($f_i = -\infty$).
- La verificación de invariantes (`audit.ts`) comprueba expresamente que la suma de repeticiones en celdas nulas sea idénticamente cero.

---

## 4. Política de Redondeo para Cargas en Kilogramos

A diferencia de las repeticiones (que deben sumar un total finito), las cargas en kilogramos representan intensidades prescritas para los discos en la barra durante el entrenamiento.

### Regla de Redondeo Estándar ($0.5 \uparrow$):
Dada la carga teórica continua en kilogramos $C = \text{Rendimiento} \times \frac{Z}{100}$:
$$\text{Carga}_{\text{final}} = \text{Math.round}(C) = \lfloor C + 0.5 \rfloor$$

Ejemplos:
- $105.49\text{ kg} \longrightarrow 105\text{ kg}$
- $105.50\text{ kg} \longrightarrow 106\text{ kg}$
- $105.51\text{ kg} \longrightarrow 106\text{ kg}$

---

## 5. Reporte de Transparencia y Errores de Aproximación

Para asegurar el control metodológico por parte del entrenador, la aplicación reporta en tiempo real:
1. **Volumen Teórico vs Volumen Discreto**:
   - Desviación observada en cada celda: $\delta = x_i - q_i$.
   - Verificación de que $|\delta| < 1$ en todos los casos.
2. **IMR Teórica vs IMR Real**:
   - IMR Teórica del microciclo: $\text{IMR}_{\text{meso}} + \Delta \text{IMR}$.
   - IMR Real ponderada alcanzada con las repeticiones enteras asignadas:
     $$\text{IMR}_{\text{real}} = \frac{\sum (R_z \times z)}{\sum R_z}$$
   - Desviación absoluta: $|\text{IMR}_{\text{real}} - \text{IMR}_{\text{teórica}}|$, que en promedio oscila en un margen estrecho de $\pm 0.1\%$ a $\pm 0.4\%$.
