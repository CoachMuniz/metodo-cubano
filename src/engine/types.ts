export type ExerciseName = 
  | 'Snatch' 
  | 'Clean & Jerk' 
  | 'Squats' 
  | 'Snatch Pulls' 
  | 'Clean Pulls';

export type DayName = 
  | 'Lunes' 
  | 'Martes' 
  | 'Miércoles' 
  | 'Jueves' 
  | 'Viernes' 
  | 'Sábado';

export type DurationOption = 2 | 3 | 4 | 5;

export interface MicrocycleAlternative {
  id: number;
  duration: DurationOption;
  label: string;
  volumePercentages: number[]; // sum = 100
  imrDisplacements: number[];
  description?: string;
}

export interface ReferenceLoads {
  totalOlympic: number;
  snatch: number;
  cleanAndJerk: number;
  squats: number;
  snatchPulls: number;
  cleanPulls: number;
}

export interface ExerciseHierarchy {
  ptPercent: number;
  pfPercent: number;
  snatchInPtPercent: number;
  cleanAndJerkInPtPercent: number;
  squatsInPfPercent: number;
  pullsInPfPercent: number;
  snatchPullsInPullsPercent: number;
  cleanPullsInPullsPercent: number;
  // Computed final mesocycle proportion for each exercise (sum = 1.0)
  proportions: { [key in ExerciseName]: number };
  // Target reps in mesocycle
  targetReps: { [key in ExerciseName]: number };
}

export interface UserInputData {
  totalOlympicKg: number;
  totalReps: number;
  ptPercent: number;
  snatchInPtPercent: number;
  squatsInPfPercent: number;
  snatchPullsInPullsPercent: number;
  durationMicros: DurationOption;
  selectedAlternativeIndex: number;
  targetMesocycleImr: number;
  planName?: string;
  athleteName?: string;
}

export interface VariantTableEntry {
  imr: number;
  variant: string;
  code: string;
  distribution: { [intensity: string]: number };
  total: number;
}

export interface PrescribedZone {
  intensityPercent: number;
  theoreticalKg: number;
  loadKg: number; // rounded according to policy (0.5 rounds up)
  effectiveIntensityPercent: number; // loadKg / refKg * 100
  reps: number;
}

export interface DailyExercisePlan {
  exercise: ExerciseName;
  reps: number;
  referenceKg: number;
  variantCode: string;
  zones: PrescribedZone[];
  realImr: number;
  targetImr: number;
}

export interface DailyPlan {
  day: DayName;
  dayIndex: number;
  totalReps: number;
  exercises: DailyExercisePlan[];
}

export interface MicrocycleExercisePlan {
  exercise: ExerciseName;
  reps: number;
  targetImr: number;
  realImr: number;
  imrError: number;
  variantCode: string;
  zones: PrescribedZone[];
}

export interface MicrocyclePlan {
  microIndex: number; // 0-based
  microNumber: number; // 1-based
  volumePercent: number;
  targetReps: number;
  actualReps: number;
  targetImr: number;
  realImr: number;
  imrDisplacement: number;
  exercises: { [key in ExerciseName]: MicrocycleExercisePlan };
  days: DailyPlan[];
}

export interface MathAuditCheck {
  name: string;
  passed: boolean;
  message: string;
  expected?: number | string;
  actual?: number | string;
}

export interface MathAuditResult {
  isVolumeConserved100: boolean;
  mesocycleRepsDiff: number;
  checks: MathAuditCheck[];
  summary: {
    totalTargetReps: number;
    totalActualReps: number;
    sumMicrocyclesReps: number;
    sumExercisesReps: number;
    sumDaysReps: number;
    sumZonesReps: number;
    maxImrDeviation: number;
    averageImrDeviation: number;
  };
}

export interface MesocyclePlan {
  id: string;
  createdAt: string;
  name: string;
  athleteName?: string;
  input: UserInputData;
  referenceLoads: ReferenceLoads;
  exerciseHierarchy: ExerciseHierarchy;
  microcycles: MicrocyclePlan[];
  totalRepsTarget: number;
  totalRepsActual: number;
  targetImr: number;
  realImr: number;
  imrDeviation: number;
  audit: MathAuditResult;
}
