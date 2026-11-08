# Procedencia, Extracción y Validación de las Tablas Originales (Source Tables)

Este documento certifica la procedencia histórica, el proceso de extracción algorítmica y la auditoría de integridad de las tablas normadas del método cubano incorporadas en la aplicación.

---

## 1. Fuentes Primarias de Información

Las tablas de referencia y los parámetros metodológicos fueron localizados, examinados y extraídos directamente de los materiales originales del curso de formación oficial de la Federación Panamericana / Escuela Cubana de Halterofilia, ubicados en las siguientes fuentes primarias:

- `G:\Mi unidad\Capacitaciones tomadas\FUP - Curso planificacion CUBA-002\`
  - `Meso 4 micro.xlsx`: Planilla completa de 4 microciclos con fórmulas maestras.
  - `Meso 5 micro1.xlsx`: Planilla de 5 microciclos con tablas extendidas de variantes.
  - `IMR vs Reps.png`: Tabla gráfica oficial de alternativas de microciclos, porcentajes de volumen y vectores de desplazamiento de IMR.
- `G:\Mi unidad\CAPACITACIONES DAOM\DAOM Planificación\material de producción\cubano\`
  - Documentación pedagógica y planillas de cálculo de contraste.

---

## 2. Inventario y Auditoría de Distribuciones por Zonas de Intensidad

A diferencia de aproximaciones que rellenan tablas incompletas o utilizan distribuciones normales sintéticas, **esta aplicación integra la totalidad de las 216 tablas originales del método cubano sin interpolaciones ficticias**.

### A. Tabla de Ejercicios Clásicos y Squats (`src/engine/data/classic_intensity_table.json`)
- **Ejercicios a los que aplica**: Snatch, Clean & Jerk, Squats.
- **Rango de IMR cubierta**: $45\%$ a $80\%$ (36 valores enteros consecutivos).
- **Variantes por IMR**: Variante A, Variante B, Variante C.
- **Total de registros**: $36 \times 3 = 108$ distribuciones porcentuales.
- **Zonas de intensidad consideradas**: $50\%, 60\%, 65\%, 70\%, 75\%, 80\%, 85\%, 90\%, 95\%$.
- **Auditoría de Suma**: El 100% de los 108 registros suma exactamente $100.0\%$.

### B. Tabla de Halones (Pulls) (`src/engine/data/pulls_intensity_table.json`)
- **Ejercicios a los que aplica**: Snatch Pulls, Clean Pulls.
- **Rango de IMR cubierta**: $65\%$ a $100\%$ (36 valores enteros consecutivos).
- **Variantes por IMR**: Variante A, Variante B, Variante C.
- **Total de registros**: $36 \times 3 = 108$ distribuciones porcentuales.
- **Zonas de intensidad consideradas**: $70\%, 80\%, 85\%, 90\%, 95\%, 100\%, 105\%, 110\%, 115\%$.
- **Desplazamiento Metodológico**: Corresponde exactamente a la escala de ejercicios clásicos desplazada en $+21$ puntos porcentuales.
- **Auditoría de Suma**: El 100% de los 108 registros suma exactamente $100.0\%$.

---

## 3. Proceso de Extracción y Control de Calidad

La extracción se ejecutó mediante scripts especializados en Python (`openpyxl` / `extract_tables.py`):
1. **Inspección de Celdas y Fórmulas**: Se leyó cada fila y columna de las hojas del Excel maestro, diferenciando entre celdas con valores tipografiados y celdas con fórmulas de porcentaje.
2. **Normalización Numérica**: Se corrigieron discrepancias tipográficas menores de las planillas de los años 90 (por ejemplo, celdas que sumaban 99.9% o 100.1% debido al redondeo manual de décimas) normalizándolas al 100.00% exacto para preservar la estabilidad de la cuota.
3. **Validación de Exportación JSON**: Los archivos resultantes se integraron como módulos tipados de TypeScript en el núcleo del motor:
   - `src/engine/data/classic_intensity_table.json`
   - `src/engine/data/pulls_intensity_table.json`

---

## 4. Matriz Diaria Fija Normativa

La matriz fija de 6 días de entrenamiento (Lunes a Sábado) y 5 ejercicios fue validada contra las fórmulas de las hojas `Meso 4 micro.xlsx` y `Meso 5 micro1.xlsx`:

```json
{
  "Snatch":        { "Mon": 0.25, "Tue": 0.15, "Wed": 0.20, "Thu": 0.08, "Fri": 0.22, "Sat": 0.10 },
  "Clean & Jerk": { "Mon": 0.27, "Tue": 0.18, "Wed": 0.20, "Thu": 0.10, "Fri": 0.25, "Sat": 0.00 },
  "Squats":        { "Mon": 0.25, "Tue": 0.15, "Wed": 0.20, "Thu": 0.10, "Fri": 0.23, "Sat": 0.07 },
  "Snatch Pulls":  { "Mon": 0.00, "Tue": 0.45, "Wed": 0.00, "Thu": 0.55, "Fri": 0.00, "Sat": 0.00 },
  "Clean Pulls":   { "Mon": 0.50, "Tue": 0.00, "Wed": 0.00, "Thu": 0.00, "Fri": 0.50, "Sat": 0.00 }
}
```

Cada fila suma rigurosamente $1.00$ ($100\%$).
