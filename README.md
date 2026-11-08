# Calculadora del Método Cubano de Weightlifting — PWA

Aplicación Web Progresiva (PWA) de nivel profesional para la planificación automatizada, matemáticamente exacta y metodológicamente rigurosa de mesociclos de halterofilia (Weightlifting) según el **Método Cubano**.

Desarrollada bajo los lineamientos oficiales de la escuela cubana de levantamiento de pesas y el sistema de diseño visual **DAOM Weightlifting** (paleta oscura de alto contraste: `#0B0B0D`, `#1677D2`, `#FFFFFF`, `#D1D5DB`).

---

## 🌟 Características Principales

1. **Exactitud Matemática Absoluta (Conservación del 100% del Volumen)**:
   - Reparto biproporcional de repeticiones enteras mediante el **Método del Resto Mayor (Hamilton / Hare-Niemeyer)**.
   - Distribución matricial bidimensional por microciclos, ejercicios, días de la semana e intensidades.
   - Cero pérdida o ganancia de repeticiones en cualquier nivel de agregación ($\sum \text{repeticiones} = \text{Volumen Total}$).

2. **Fidelidad Metodológica al Sistema Cubano**:
   - Tablas originales completas de distribución por zonas de intensidad:
     - **Ejercicios Clásicos y Cuclillas (Squats)**: 108 distribuciones (IMR 45% a 80%, variantes A, B y C; zonas 50% a 95%).
     - **Halones (Pulls)**: 108 distribuciones (IMR 65% a 100%, variantes A, B y C; zonas 70% a 115%).
   - Desplazamientos metodológicos de IMR originales por microciclo para duraciones de 2, 3, 4 y 5 microciclos.
   - Selección algorítmica determinista de la variante A/B/C que minimiza el error cuadrático respecto a la IMR teórica del microciclo.
   - Matriz fija de distribución semanal (Lunes a Sábado) según los porcentajes reglamentarios cubanos.

3. **Cálculo Automático de Cargas en Kilogramos**:
   - Rendimientos de referencia derivados estrictamente del Mejor Total Olímpico:
     - $\text{Snatch} = \text{Total Olímpico} \times 0.43$
     - $\text{Clean \& Jerk} = \text{Total Olímpico} \times 0.57$
     - $\text{Squats} = \text{Total Olímpico} \times 0.732$
     - $\text{Snatch Pulls} = \text{Referencia de Snatch}$
     - $\text{Clean Pulls} = \text{Referencia de Clean \& Jerk}$
   - Conversión exacta a kilogramos enteros (redondeo estándar $0.5 \uparrow$).

4. **Auditoría Matemática en Tiempo Real**:
   - Panel de auditoría algorítmica que verifica 8 invariantes formales en vivo (conservación de volumen, concordancia de ejercicios, IMR real vs teórica, rangos de error de aproximación).

5. **PWA Instalable y Funcionamiento Offline**:
   - Service Worker con estrategia Cache-First para operación 100% offline sin conexión a internet.
   - Manifiesto PWA completo (`manifest.json`) e icono vectorial de alta definición.
   - Persistencia local en el dispositivo del usuario mediante `LocalStorage` (guardar, renombrar, cargar y eliminar mesociclos).

6. **Exportación Multipropósito**:
   - **Excel profesional (`.xlsx`)**: 4 hojas estructuradas (Resumen General, Microciclos y Variantes, Distribución Diaria, Cargas en Kilogramos).
   - **Impresión y PDF optimizado**: Vista imprimible formateada para entrenadores de sala.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura desacoplada y modular:

```
src/
├── engine/                      # Motor de cálculo y optimización pura (sin UI)
│   ├── types.ts                 # Modelos de datos, tipos TypeScript e interfaces
│   ├── constants.ts             # Coeficientes, matriz diaria y alternativas de microciclos
│   ├── apportionment.ts         # Algoritmos de reparto de Hamilton y biproporcional 2D
│   ├── variantSelector.ts       # Selector determinista de variantes A/B/C con desempate
│   ├── calculator.ts            # Orquestador del mesociclo completo
│   ├── audit.ts                 # Verificador de 8 invariantes matemáticas
│   └── data/                    # Tablas de intensidad originales extraídas
│       ├── classic_intensity_table.json  # 108 entradas (45a a 80c)
│       └── pulls_intensity_table.json    # 108 entradas (65a a 100c)
├── storage/                     # Persistencia local (LocalStorage)
│   └── planStore.ts
├── export/                      # Módulos de exportación
│   ├── excelExport.ts           # Generador de hojas de cálculo (.xlsx)
│   └── pdfExport.ts             # Preparación para impresión/PDF
├── components/                  # Interfaz de usuario (React + Lucide Icons)
│   ├── Header.tsx               # Barra superior con navegación y acciones rápidas
│   ├── Step1GeneralData.tsx     # Formulario de datos iniciales y validación
│   ├── Step2MicrocycleAlternatives.tsx # Selector de duración y alternativas
│   ├── GeneralOverview.tsx      # Métricas globales y tablas de mesociclo
│   ├── MicrocycleView.tsx       # Detalle de cada microciclo y selección A/B/C
│   ├── DailyView.tsx            # Matriz diaria de repeticiones y cargas en kg
│   ├── MathematicalAuditModal.tsx # Modal de auditoría matemática en vivo
│   ├── SavedPlansModal.tsx      # Gestor de mesociclos guardados
│   └── ExportBar.tsx            # Botones de exportación (Excel, PDF, Guardar)
├── styles/
│   └── daom-theme.css           # Tokens y estilos DAOM Weightlifting
├── App.tsx                      # Componente raíz y control de flujo
└── main.tsx                     # Punto de entrada y registro de Service Worker
```

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- **Node.js**: v18.0.0 o superior (recomendado v20+ o v24+).
- **npm**: v9.0.0 o superior.

### 1. Clonar o acceder al repositorio
```bash
cd "c:\Users\matia\OneDrive\Documentos\método cubano"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```
La aplicación estará disponible de inmediato en `http://localhost:5173/` (o el puerto asignado por Vite).

### 4. Compilar para producción
```bash
npm run build
```
Genera los archivos estáticos optimizados en la carpeta `dist/`.

### 5. Previsualizar la versión de producción localmente
```bash
npm run preview
```

### 6. Ejecutar las pruebas automatizadas
```bash
npm test
```
O con reporte detallado:
```bash
npx vitest run
```

---

## 📱 Cómo Instalar la PWA

### En Google Chrome / Microsoft Edge (Escritorio)
1. Abrí la aplicación en el navegador.
2. En la barra de direcciones aparecerá el icono **"Instalar aplicación"** (o en el menú `...` > *Instalar Calculadora Método Cubano*).
3. Hacé clic en **Instalar**. La aplicación se ejecutará en su propia ventana sin barra de navegación del explorador y estará disponible sin conexión.

### En Dispositivos Móviles (Android / Chrome)
1. Abrí la URL en Google Chrome.
2. Tocá los tres puntos del menú superior derecho.
3. Seleccioná **"Agregar a la pantalla principal"** o **"Instalar aplicación"**.

### En Dispositivos iOS (iPhone / Safari)
1. Abrí la URL en Safari.
2. Tocá el botón de **Compartir** (icono de cuadrado con flecha hacia arriba).
3. Seleccioná **"Agregar al inicio"**.

---

## 📚 Documentación Técnica Adicional

Para un análisis detallado de cada aspecto del sistema, consultá los siguientes documentos en la raíz del proyecto:

- [METHODOLOGY.md](file:///./METHODOLOGY.md): Fundamentos del método cubano, relaciones de rendimiento, porcentajes jerárquicos y tablas.
- [CALCULATION_ENGINE.md](file:///./CALCULATION_ENGINE.md): Algoritmos de reparto de Hamilton, biproporcionalidad y cálculo de IMR real.
- [ROUNDING_POLICY.md](file:///./ROUNDING_POLICY.md): Política de redondeo y conservación de volumen en números enteros.
- [SOURCE_TABLES.md](file:///./SOURCE_TABLES.md): Procedencia, extracción y validación de las 216 tablas de intensidad originales.
- [TEST_REPORT.md](file:///./TEST_REPORT.md): Reporte exhaustivo de la suite de 91 pruebas unitarias y de propiedades.
- [KNOWN_LIMITATIONS.md](file:///./KNOWN_LIMITATIONS.md): Límites metodológicos y de entrada del sistema.
