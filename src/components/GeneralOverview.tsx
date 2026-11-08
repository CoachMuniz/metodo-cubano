import React from 'react';
import { MesocyclePlan } from '../engine/types';
import { Dumbbell, Target, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface GeneralOverviewProps {
  plan: MesocyclePlan;
}

export const GeneralOverview: React.FC<GeneralOverviewProps> = ({ plan }) => {
  const isAuditPassed = plan.audit.isVolumeConserved100;

  return (
    <div className="daom-card" style={{ marginBottom: 24 }}>
      <div className="daom-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            11.1 Resumen General del Mesociclo
          </h2>
          <p style={{ fontSize: 13, color: 'var(--daom-text-secondary)', margin: 0 }}>
            {plan.name} {plan.athleteName ? `— Atleta: ${plan.athleteName}` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <span className={`badge ${isAuditPassed ? 'badge-success' : 'badge-danger'}`}>
            {isAuditPassed ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>Volumen 100% Conservado</span>
          </span>
          <span className="badge badge-info">
            {plan.input.durationMicros} Microciclos
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Rendimiento Olímpico y Referencias */}
        <div style={{
          backgroundColor: 'var(--daom-surface-2)',
          padding: 16,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--daom-border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--daom-primary)', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            <Dumbbell size={16} />
            <span>Rendimiento Olímpico</span>
          </div>

          <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
            {plan.input.totalOlympicKg} kg
            <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--daom-text-muted)', marginLeft: 6 }}>Total Olímpico</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--daom-text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Snatch (43%):</span>
              <strong style={{ color: '#FFFFFF' }}>{plan.referenceLoads.snatch.toFixed(1)} kg</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Clean & Jerk (57%):</span>
              <strong style={{ color: '#FFFFFF' }}>{plan.referenceLoads.cleanAndJerk.toFixed(1)} kg</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Squats (73.2%):</span>
              <strong style={{ color: '#FFFFFF' }}>{plan.referenceLoads.squats.toFixed(1)} kg</strong>
            </div>
          </div>
        </div>

        {/* Volumen y Distribución PT/PF */}
        <div style={{
          backgroundColor: 'var(--daom-surface-2)',
          padding: 16,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--daom-border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--daom-primary)', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            <Activity size={16} />
            <span>Volumen y Distribución</span>
          </div>

          <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
            {plan.totalRepsActual}
            <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--daom-text-muted)', marginLeft: 6 }}>repeticiones</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--daom-text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Prep. Técnica (PT):</span>
              <strong style={{ color: '#FFFFFF' }}>{plan.exerciseHierarchy.ptPercent}% ({Math.round(plan.totalRepsActual * plan.exerciseHierarchy.ptPercent / 100)} reps)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Prep. Física (PF):</span>
              <strong style={{ color: '#FFFFFF' }}>{plan.exerciseHierarchy.pfPercent}% ({Math.round(plan.totalRepsActual * plan.exerciseHierarchy.pfPercent / 100)} reps)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Alternativa Seleccionada:</span>
              <strong style={{ color: '#FFFFFF' }}>Alt. {plan.input.selectedAlternativeIndex + 1}</strong>
            </div>
          </div>
        </div>

        {/* IMR Objetivo y Real */}
        <div style={{
          backgroundColor: 'var(--daom-surface-2)',
          padding: 16,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--daom-border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--daom-primary)', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            <Target size={16} />
            <span>Intensidad Media Relativa (IMR)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF' }}>
              {plan.realImr}%
              <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--daom-text-muted)', marginLeft: 6 }}>Real</span>
            </div>
            <div style={{ fontSize: 14, color: 'var(--daom-text-secondary)' }}>
              Objetivo: <strong>{plan.targetImr}%</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--daom-text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Desviación Neta:</span>
              <strong style={{ color: Math.abs(plan.imrDeviation) <= 0.5 ? 'var(--daom-success)' : 'var(--daom-warning)' }}>
                {plan.imrDeviation > 0 ? `+${plan.imrDeviation}` : plan.imrDeviation}%
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Desv. Máx. Microciclo:</span>
              <strong style={{ color: '#FFFFFF' }}>{plan.audit.summary.maxImrDeviation}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Desv. Promedio Microciclo:</span>
              <strong style={{ color: '#FFFFFF' }}>{plan.audit.summary.averageImrDeviation}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Repeticiones por Ejercicio en el Mesociclo */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ejercicio</th>
              <th>Grupo</th>
              <th style={{ textAlign: 'right' }}>% Total Mesociclo</th>
              <th style={{ textAlign: 'right' }}>Repeticiones Teóricas</th>
              <th style={{ textAlign: 'right' }}>Repeticiones Asignadas</th>
              <th style={{ textAlign: 'right' }}>Rendimiento Ref. (kg)</th>
            </tr>
          </thead>
          <tbody>
            {(['Snatch', 'Clean & Jerk', 'Squats', 'Snatch Pulls', 'Clean Pulls'] as const).map(ex => {
              const prop = plan.exerciseHierarchy.proportions[ex];
              const theoReps = plan.totalRepsActual * prop;
              const actualReps = plan.exerciseHierarchy.targetReps[ex];
              const refKg = plan.referenceLoads[
                ex === 'Snatch' ? 'snatch' :
                ex === 'Clean & Jerk' ? 'cleanAndJerk' :
                ex === 'Squats' ? 'squats' :
                ex === 'Snatch Pulls' ? 'snatchPulls' : 'cleanPulls'
              ];
              const isPt = ex === 'Snatch' || ex === 'Clean & Jerk';

              return (
                <tr key={ex}>
                  <td style={{ fontWeight: 700 }}>{ex}</td>
                  <td>
                    <span className={`badge ${isPt ? 'badge-info' : 'badge-warning'}`} style={{ fontSize: 11 }}>
                      {isPt ? 'Técnica (PT)' : 'Fuerza (PF)'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>{(prop * 100).toFixed(2)}%</td>
                  <td style={{ textAlign: 'right', color: 'var(--daom-text-secondary)' }}>{theoReps.toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--daom-primary)' }}>{actualReps}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{refKg.toFixed(1)} kg</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
