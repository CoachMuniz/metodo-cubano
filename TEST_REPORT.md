# Informe Exhaustivo de Pruebas Automatizadas y Auditoría Matemática (Test Report)

Este documento certifica los resultados de la suite completa de pruebas unitarias, de integración, de propiedades combinatorias y de casos límite ejecutada sobre el motor de la PWA.

---

## 1. Resumen Ejecutivo de la Suite de Pruebas

- **Entorno de Pruebas**: Vitest v2.1.9 (`node v24.11.1`).
- **Archivos de Prueba**: 5 suites independientes.
- **Total de Pruebas Ejecutadas**: **91 pruebas**.
- **Resultado**: **91 aprobadas (100%), 0 fallidas, 0 omitidas**.
- **Tiempo de Ejecución**: 943 ms.

```
 RUN  v2.1.9 C:/Users/matia/OneDrive/Documentos/método cubano

 ✓ tests/variantSelection.test.ts (3 tests) 20ms
 ✓ tests/loadKgConversion.test.ts (2 tests) 24ms
 ✓ tests/extremeEdgeCases.test.ts (5 tests) 46ms
 ✓ tests/referenceComparison.test.ts (1 test) 61ms
 ✓ tests/volumeConservation.test.ts (80 tests) 276ms

 Test Files  5 passed (5)
      Tests  91 passed (91)
   Duration  943ms
```

---

## 2. Detalle por Suite de Pruebas

### 2.1. Conservación Absoluta del Volumen (`tests/volumeConservation.test.ts` — 80 pruebas)
Esta suite somete al motor a un barrido combinatorio exhaustivo:
- **Duraciones evaluadas**: 2, 3, 4 y 5 microciclos (todas las alternativas disponibles).
- **Volúmenes evaluados**: 300, 600, 950, 1250, 1800, 2500 repeticiones.
- **Ratios PT / PF evaluados**: 40/60, 50/50, 55/45, 65/35.
- **Distribuciones internas**: Variaciones de Snatch en PT (45% a 55%), Squats en PF (40% a 60%), Snatch Pulls en Pulls (45% a 60%).

#### Invariantes Verificados en cada una de las 80 combinaciones:
1. $\sum \text{Repeticiones de Microciclos} \equiv \text{Volumen Total}$.
2. $\sum \text{Repeticiones de Ejercicios en Mesociclo} \equiv \text{Volumen Total}$.
3. Para cada microciclo: $\sum \text{Ejercicios} \equiv \text{Total del Microciclo}$.
4. Para cada ejercicio en cada microciclo: $\sum \text{Zonas de Intensidad} \equiv \text{Total del Ejercicio en el Micro}$.
5. Para cada día de la semana: $\sum \text{Ejercicios del Día} \equiv \text{Total del Día}$.
6. Suma total de la matriz diaria $\equiv \text{Volumen Total}$.

---

### 2.2. Selección Determinista de Variantes A/B/C (`tests/variantSelection.test.ts` — 3 pruebas)
- **Determinismo y Reproducibilidad**: Se comprueba que dadas las mismas entradas de repeticiones e IMR teórica, el algoritmo produce la misma selección de variante ($A, B$ o $C$).
- **Minimización del Error Cuadrático**: Se verifica matemáticamente que la variante escogida tiene un error absoluto respecto a la IMR teórica menor o igual que las otras dos variantes candidatas.
- **Resolución de Empates**: Se verifica que ante empates de error absoluto se aplique la regla determinista de prioridad alfabética ($A \succ B \succ C$).

---

### 2.3. Conversión de Cargas a Kilogramos (`tests/loadKgConversion.test.ts` — 2 pruebas)
- **Exactitud de Coeficientes de Referencia**:
  - Para un Total Olímpico de $250\text{ kg}$:
    - $\text{Snatch} = 250 \times 0.43 = 107.5\text{ kg}$
    - $\text{Clean \& Jerk} = 250 \times 0.57 = 142.5\text{ kg}$
    - $\text{Squats} = 250 \times 0.732 = 183.0\text{ kg}$
- **Redondeo al Kilogramo Entero ($0.5 \uparrow$)**:
  - Comprobación en todas las zonas de intensidad ($50\%$ a $115\%$) de que las cargas resultantes son números enteros no negativos que siguen rigurosamente el redondeo simétrico.

---

### 2.4. Comparación contra el Benchmark del Excel Oficial (`tests/referenceComparison.test.ts` — 1 prueba)
- Se modeló el caso canónico del curso cubano: Total Olímpico $250\text{ kg}$, $1250$ repeticiones, $4$ microciclos (Alternativa 1), IMR objetivo $67\%$, $PT = 55\%$.
- Se contrastaron los resultados con la planilla `Meso 4 micro.xlsx`:
  - Se confirmó la convergencia de las tendencias metodológicas.
  - Se demostró que el motor web elimina la pérdida de 8 repeticiones que sufre la planilla Excel original por causa de los redondeos celda a celda independientes.

---

### 2.5. Casos Límite y Auditoría Algorítmica (`tests/extremeEdgeCases.test.ts` — 5 pruebas)
- **Volumen Mínimo Extremo (100 repeticiones)**: El motor reparte las repeticiones sin divisiones por cero ni errores de índice.
- **Volumen Elevado (5000 repeticiones)**: Estabilidad numérica sin desbordamiento.
- **IMR Límite Inferior (45%) y Superior (80%)**: Correcta recuperación de las tablas extremas $45a, 45b, 45c$ y $80a, 80b, 80c$ sin excepciones fuera de rango.
- **Preservación Inviolable de Días Cero**: Auditoría estricta de que en los días con porcentaje metodológico cero (p. ej., Sábado en Clean & Jerk; Lunes, Miércoles, Viernes y Sábado en Snatch Pulls) se asignan exactamente $0$ repeticiones.
- **Motor de Invariantes (`verifyMesocycleInvariants`)**: Verificación de que el validador en vivo detecta y aprueba el 100% de los 8 invariantes formales en tiempo de ejecución.
