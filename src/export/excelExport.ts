import * as XLSX from 'xlsx';
import { MesocyclePlan } from '../engine/types';

export function exportPlanToExcel(plan: MesocyclePlan): void {
  const wb = XLSX.utils.book_new();

  // HOJA 1: RESUMEN GENERAL
  const generalData: (string | number)[][] = [
    ['PLANIFICACIÓN DE MESOCICLO DE WEIGHTLIFTING — MÉTODO CUBANO'],
    ['Generado automáticamente con el motor de optimización matemática'],
    [],
    ['DATOS DE IDENTIFICACIÓN'],
    ['Nombre del Plan', plan.name],
    ['Atleta', plan.athleteName || 'No especificado'],
    ['Fecha de Creación', new Date(plan.createdAt).toLocaleDateString('es-ES')],
    [],
    ['RENDIMIENTO DEPORTIVO (4.1)'],
    ['Mejor Total Olímpico', `${plan.input.totalOlympicKg} kg`],
    ['Rendimiento de Referencia Snatch (43%)', `${plan.referenceLoads.snatch.toFixed(2)} kg`],
    ['Rendimiento de Referencia Clean & Jerk (57%)', `${plan.referenceLoads.cleanAndJerk.toFixed(2)} kg`],
    ['Rendimiento de Referencia Squats (73.2%)', `${plan.referenceLoads.squats.toFixed(2)} kg`],
    ['Rendimiento de Referencia Snatch Pulls', `${plan.referenceLoads.snatchPulls.toFixed(2)} kg`],
    ['Rendimiento de Referencia Clean Pulls', `${plan.referenceLoads.cleanPulls.toFixed(2)} kg`],
    [],
    ['VOLUMEN Y DISTRIBUCIONES (4.2 - 4.4)'],
    ['Volumen Total del Mesociclo', `${plan.totalRepsActual} repeticiones`],
    ['Preparación Técnica (PT)', `${plan.exerciseHierarchy.ptPercent}%`],
    ['Preparación Física (PF)', `${plan.exerciseHierarchy.pfPercent}%`],
    ['Snatch dentro de PT', `${plan.exerciseHierarchy.snatchInPtPercent}%`],
    ['Clean & Jerk dentro de PT', `${plan.exerciseHierarchy.cleanAndJerkInPtPercent}%`],
    ['Squats dentro de PF', `${plan.exerciseHierarchy.squatsInPfPercent}%`],
    ['Pulls dentro de PF', `${plan.exerciseHierarchy.pullsInPfPercent}%`],
    ['Snatch Pulls dentro de Pulls', `${plan.exerciseHierarchy.snatchPullsInPullsPercent}%`],
    ['Clean Pulls dentro de Pulls', `${plan.exerciseHierarchy.cleanPullsInPullsPercent}%`],
    [],
    ['REPETICIONES POR EJERCICIO EN EL MESOCICLO'],
    ['Snatch', plan.exerciseHierarchy.targetReps.Snatch],
    ['Clean & Jerk', plan.exerciseHierarchy.targetReps['Clean & Jerk']],
    ['Squats', plan.exerciseHierarchy.targetReps.Squats],
    ['Snatch Pulls', plan.exerciseHierarchy.targetReps['Snatch Pulls']],
    ['Clean Pulls', plan.exerciseHierarchy.targetReps['Clean Pulls']],
    ['Suma de Ejercicios', Object.values(plan.exerciseHierarchy.targetReps).reduce((a, b) => a + b, 0)],
    [],
    ['INTENSIDAD MEDIA RELATIVA (IMR)'],
    ['IMR Objetivo del Mesociclo', `${plan.targetImr}%`],
    ['IMR Real Alcanzada', `${plan.realImr}%`],
    ['Desviación de IMR', `${plan.imrDeviation > 0 ? '+' : ''}${plan.imrDeviation}%`],
    [],
    ['ESTADO DE AUDITORÍA MATEMÁTICA'],
    ['Conservación de Volumen (100%)', plan.audit.isVolumeConserved100 ? 'CONSERVADO EXACTO' : 'FALLIDO'],
    ['Diferencia de Repeticiones', plan.audit.mesocycleRepsDiff],
  ];

  const wsGeneral = XLSX.utils.aoa_to_sheet(generalData);
  XLSX.utils.book_append_sheet(wb, wsGeneral, 'Resumen General');

  // HOJA 2: RESUMEN POR MICROCICLOS
  const microHeaders = [
    'Microciclo',
    'Volumen (%)',
    'Repeticiones',
    'Desplazamiento IMR',
    'IMR Objetivo (%)',
    'IMR Real (%)',
    'Desviación IMR',
    'Snatch Reps',
    'Clean & Jerk Reps',
    'Squats Reps',
    'Snatch Pulls Reps',
    'Clean Pulls Reps'
  ];

  const microRows = plan.microcycles.map(m => [
    `Microciclo ${m.microNumber}`,
    `${m.volumePercent}%`,
    m.actualReps,
    `${m.imrDisplacement >= 0 ? '+' : ''}${m.imrDisplacement}`,
    `${m.targetImr}%`,
    `${m.realImr}%`,
    `${(m.realImr - m.targetImr).toFixed(2)}%`,
    m.exercises.Snatch?.reps || 0,
    m.exercises['Clean & Jerk']?.reps || 0,
    m.exercises.Squats?.reps || 0,
    m.exercises['Snatch Pulls']?.reps || 0,
    m.exercises['Clean Pulls']?.reps || 0,
  ]);

  const wsMicro = XLSX.utils.aoa_to_sheet([microHeaders, ...microRows]);
  XLSX.utils.book_append_sheet(wb, wsMicro, 'Por Microciclos');

  // HOJA 3: PLANIFICACIÓN DIARIA COMPLETA
  const dailyHeaders = [
    'Microciclo',
    'Día',
    'Ejercicio',
    'Variante',
    'Intensidad (%)',
    'Carga Teórica (kg)',
    'Carga Final (kg)',
    'Intensidad Efectiva (%)',
    'Repeticiones'
  ];

  const dailyRows: (string | number)[][] = [];

  for (const m of plan.microcycles) {
    for (const d of m.days) {
      for (const ex of d.exercises) {
        if (ex.reps <= 0) continue;
        for (const z of ex.zones) {
          if (z.reps <= 0) continue;
          dailyRows.push([
            `Micro ${m.microNumber}`,
            d.day,
            ex.exercise,
            ex.variantCode,
            `${z.intensityPercent}%`,
            parseFloat(z.theoreticalKg.toFixed(2)),
            z.loadKg,
            parseFloat(z.effectiveIntensityPercent.toFixed(2)),
            z.reps
          ]);
        }
      }
    }
  }

  const wsDaily = XLSX.utils.aoa_to_sheet([dailyHeaders, ...dailyRows]);
  XLSX.utils.book_append_sheet(wb, wsDaily, 'Planificación Diaria');

  // HOJA 4: AUDITORÍA MATEMÁTICA
  const auditHeaders = ['Verificación Formal', 'Estado', 'Detalle Técnico'];
  const auditRows = plan.audit.checks.map(c => [
    c.name,
    c.passed ? 'APROBADO' : 'FALLIDO',
    c.message
  ]);

  const wsAudit = XLSX.utils.aoa_to_sheet([auditHeaders, ...auditRows]);
  XLSX.utils.book_append_sheet(wb, wsAudit, 'Auditoría Matemática');

  // Guardar archivo
  const safeName = (plan.name || 'mesociclo_cubano').replace(/[^a-zA-Z0-9_-]/g, '_');
  XLSX.writeFile(wb, `${safeName}_planificacion.xlsx`);
}
