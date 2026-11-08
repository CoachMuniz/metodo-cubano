import { ExerciseName, DayName, DurationOption, MicrocycleAlternative, VariantTableEntry } from './types';
import classicTableJson from './data/classic_intensity_table.json';
import pullsTableJson from './data/pulls_intensity_table.json';

// 4.1 Relaciones de Rendimiento Deportivo respecto al Total Olímpico
export const PERFORMANCE_RATIOS = {
  Snatch: 0.43,
  'Clean & Jerk': 0.57,
  Squats: 0.732,
  'Snatch Pulls': 0.43,
  'Clean Pulls': 0.57,
} as const;

// 7. Distribución Fija por Días (Lunes a Sábado)
export const DAYS_ORDER: DayName[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

export const DAILY_DISTRIBUTION_TABLE: Record<ExerciseName, number[]> = {
  Snatch:        [25, 15, 20,  8, 22, 10], // suma 100%
  'Clean & Jerk':[27, 18, 20, 10, 25,  0], // suma 100%
  Squats:        [25, 15, 20, 10, 23,  7], // suma 100%
  'Snatch Pulls':[ 0, 45,  0, 55,  0,  0], // suma 100%
  'Clean Pulls': [50,  0,  0,  0, 50,  0]  // suma 100%
};

// 6. Alternativas Oficiales del Método Cubano (Volumen % y Desplazamientos de IMR)
export const MICROCYCLE_ALTERNATIVES: Record<DurationOption, MicrocycleAlternative[]> = {
  5: [
    {
      id: 1,
      duration: 5,
      label: 'Alternativa 1 (26 - 23 - 21 - 18 - 12)',
      volumePercentages: [26, 23, 21, 18, 12],
      imrDisplacements: [-2, -1, 0, 2, 3.5],
      description: 'Variante con mayor contraste de volumen final (12% en Micro V, IMR +3.5)'
    },
    {
      id: 2,
      duration: 5,
      label: 'Alternativa 2 (25 - 22 - 20 - 18 - 15)',
      volumePercentages: [25, 22, 20, 18, 15],
      imrDisplacements: [-2, -1, 0, 1.5, 3],
      description: 'Variante más equilibrada (15% en Micro V, IMR +3)'
    }
  ],
  4: [
    {
      id: 1,
      duration: 4,
      label: 'Alternativa 1 (35 - 28 - 22 - 15)',
      volumePercentages: [35, 28, 22, 15],
      imrDisplacements: [-3, 0, 2, 4],
      description: 'Variante tradicional de mayor contraste de volumen (C-CH-CH-R)'
    },
    {
      id: 2,
      duration: 4,
      label: 'Alternativa 2 (32 - 28 - 22 - 18)',
      volumePercentages: [32, 28, 22, 18],
      imrDisplacements: [-3, 0, 2, 3],
      description: 'Variante moderada de 4 microciclos'
    },
    {
      id: 3,
      duration: 4,
      label: 'Alternativa 3 (30 - 26 - 24 - 20)',
      volumePercentages: [30, 26, 24, 20],
      imrDisplacements: [-2, -1, 1, 3],
      description: 'Variante estándar del método cubano (-2, -1, +1, +3)'
    },
    {
      id: 4,
      duration: 4,
      label: 'Alternativa 4 (28 - 26 - 24 - 22)',
      volumePercentages: [28, 26, 24, 22],
      imrDisplacements: [-2, -1, 1, 2.5],
      description: 'Variante de volumen progresivo suave'
    }
  ],
  3: [
    {
      id: 1,
      duration: 3,
      label: 'Alternativa 1 (50 - 30 - 20)',
      volumePercentages: [50, 30, 20],
      imrDisplacements: [-3, 2, 4.5],
      description: 'Variante de alto impacto inicial (50% en Micro I)'
    },
    {
      id: 2,
      duration: 3,
      label: 'Alternativa 2 (45 - 35 - 25)',
      volumePercentages: [45, 35, 25],
      imrDisplacements: [-2.5, 1, 3.5],
      description: 'Variante escalonada estándar para 3 semanas'
    },
    {
      id: 3,
      duration: 3,
      label: 'Alternativa 3 (40 - 35 - 25)',
      volumePercentages: [40, 35, 25],
      imrDisplacements: [-3, 2, 4.5],
      description: 'Variante moderada inicial para 3 semanas'
    }
  ],
  2: [
    {
      id: 1,
      duration: 2,
      label: 'Alternativa 1 (60 - 40)',
      volumePercentages: [60, 40],
      imrDisplacements: [-3, 4.5],
      description: 'Variante de 2 semanas con pico acentuado de intensidad final (+4.5)'
    },
    {
      id: 2,
      duration: 2,
      label: 'Alternativa 2 (55 - 45)',
      volumePercentages: [55, 45],
      imrDisplacements: [-2, 2.5],
      description: 'Variante de 2 semanas balanceada (-2, +2.5)'
    }
  ]
};

// Offset metodológico de IMR para Halones respecto a ejercicios clásicos (documentado en CLASIF. IMR 1)
export const PULLS_IMR_OFFSET = 21;

// Tablas de intensidades tipadas
export const CLASSIC_INTENSITY_TABLE: Record<string, VariantTableEntry> = classicTableJson;
export const PULLS_INTENSITY_TABLE: Record<string, VariantTableEntry> = pullsTableJson;

// Lista de zonas porcentuales estándar
export const CLASSIC_ZONES = [50, 60, 65, 70, 75, 80, 85, 90, 95];
export const PULLS_ZONES = [70, 80, 85, 90, 95, 100, 105, 110, 115];
