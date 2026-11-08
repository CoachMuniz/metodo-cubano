# Limitaciones Conocidas y Alcance del Sistema (Known Limitations)

Este documento expone con honestidad técnica y metodológica las fronteras operativas, restricciones de entrada y condiciones de validez del sistema.

---

## 1. Rango Válido de Intensidad Media Relativa (IMR)

- **Límites de Entrada**: La IMR objetivo del mesociclo debe ser un **número entero entre 45% y 80%**.
- **Fundamento**: Las tablas normativas históricas de la escuela cubana para ejercicios clásicos y cuclillas abarcan exclusivamente el rango $45\%$ a $80\%$. En consecuencia, la tabla de halones (desplazada en $+21$ puntos) cubre de forma estricta entre $65\%$ y $100\%$.
- **Comportamiento ante Valores Fuera de Rango**: La interfaz valida y restringe la entrada de IMR para evitar extrapolaciones arbitrarias que violen las tablas originales.

---

## 2. Duraciones de Mesociclo Soportadas

- **Duraciones Válidas**: 2, 3, 4 y 5 microciclos (semanas).
- **Fundamento**: La bibliografía oficial y las hojas de cálculo cubanas definen alternativas normadas únicamente para estas cuatro duraciones.
- **Limitación**: El sistema no genera alternativas sintéticas para mesociclos de 1 semana ni de más de 5 semanas, a fin de no contravenir el principio fundamental de no inventar datos ausentes en el método original.

---

## 3. Estructura Fija de Seis Días Semanales

- **Días de Entrenamiento**: Lunes a Sábado (Domingo día fijo de descanso).
- **Invariabilidad de la Matriz**: Los porcentajes de asignación diaria son fijos e inalterables según lo estipulado en la Sección 7 del manual cubano.
- **Limitación**: No se admiten configuraciones de 3 o 4 días por semana, ya que la distribución de fatiga y volumen de la escuela cubana está calibrada para una frecuencia de 6 sesiones semanales.

---

## 4. Requerimientos de Volumen Total

- **Restricción Numérica**: El volumen total del mesociclo debe ser un **número entero positivo** ($V_{\text{total}} \in \mathbb{Z}^+$).
- **Rango Recomendado**: Entre $300$ y $3000$ repeticiones.
- **Límite Inferior**: Si bien el motor matemático tolera volúmenes tan bajos como $100$ repeticiones sin fallos técnicos, planificaciones con menos de $200$ repeticiones totales para 6 días y 5 ejercicios resultan metodológicamente inadecuadas, dado que muchas celdas diarias recibirán 0 o 1 sola repetición.

---

## 5. Rendimientos Derivados del Total Olímpico

- **Dependencia Unidireccional**: Todos los ejercicios calculan su rendimiento de referencia exclusivamente a partir del **Mejor Total Olímpico alcanzado (kg)**.
- **Limitación**: El sistema no permite sobreescribir de forma independiente el récord personal de Squats o de Pulls. Esta es una decisión metodológica estricta de la escuela cubana para preservar la armonía de proporciones de fuerza requeridas por la técnica competitiva.

---

## 6. Exportación y Compatibilidad

- **Excel (`.xlsx`)**: La exportación genera un archivo binario nativo estructurado mediante SheetJS compatible con Microsoft Excel, LibreOffice Calc y Google Sheets.
- **Almacenamiento Local**: Los mesociclos se guardan en el `LocalStorage` del navegador del usuario. Limpiar los datos del navegador borrará los planes locales a menos que se hayan exportado a Excel.
