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
      <div className="daom-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="daom-eyebrow">REPORTE METODOLÓGICO GLOBAL</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--n-900)' }}>
            11.1 Resumen General del Mesociclo
          </h2>
          <p style={{ fontSize: 13, color: 'var(--n-600)', margin: 0 }}>
            {plan.name} {plan.athleteName ? `— Atleta: ${plan.athleteName}` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className={`badge ${isAuditPassed ? 'badge-success' : 'badge-danger'}`}>
            {isAuditPassed ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>Volumen 100% Conservado</span>
          </span>
          <span className="badge badge-info">
            {plan.input.durationMicros} Microciclos
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* Rendimiento Olímpico y Referencias */}
        <div style={{
          backgroundColor: 'var(--n-100)',
          padding: 18,
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--n-200)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--daom-blue)', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
            <Dumbbell size={16} />
            <span>RENDIMIENTO OLÍMPICO</span>
          </div>

          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--n-900)', marginBottom: 8, letterSpacing: '-0.02em' }}>
            {plan.input.totalOlympicKg} kg
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--n-500)', marginLeft: 6 }}>Total Olímpico</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--n-700)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Snatch (43.0%):</span>
              <strong style={{ color: 'var(--n-900)' }}>{plan.referenceLoads.snatch.toFixed(1)} kg</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Clean & Jerk (57.0%):</span>
              <strong style={{ color: 'var(--n-900)' }}>{plan.referenceLoads.cleanAndJerk.toFixed(1)} kg</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Squats (73.2%):</span>
              <strong style={{ color: 'var(--n-900)' }}>{plan.referenceLoads.squats.toFixed(1)} kg</strong>
            </div>
          </div>
        </div>

        {/* Volumen y Distribución PT/PF */}
        <div style={{
          backgroundColor: 'var(--n-100)',
          padding: 18,
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--n-200)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--daom-blue)', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
            <Activity size={16} />
            <span>VOLUMEN Y DISTRIBUCIÓN</span>
          </div>

          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--n-900)', marginBottom: 8, letterSpacing: '-0.02em' }}>
            {plan.totalRepsActual}
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--n-500)', marginLeft: 6 }}>repeticiones</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--n-700)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Prep. Técnica (PT):</span>
              <strong style={{ color: 'var(--n-900)' }}>{plan.exerciseHierarchy.ptPercent}% ({Math.round(plan.totalRepsActual * plan.exerciseHierarchy.ptPercent / 100)} reps)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Prep. Física (PF):</span>
              <strong style={{ color: 'var(--n-900)' }}>{plan.exerciseHierarchy.pfPercent}% ({Math.round(plan.totalRepsActual * plan.exerciseHierarchy.pfPercent / 100)} reps)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Dinámica:</span>
              <strong style={{ color: 'var(--n-900)' }}>Alternativa {plan.input.selectedAlternativeIndex + 1}</strong>
            </div>
          </div>
        </div>

        {/* IMR Objetivo y Real */}
        <div style={{
          backgroundColor: 'var(--n-100)',
          padding: 18,
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--n-200)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--daom-blue)', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
            <Target size={16} />
            <span>INTENSIDAD MEDIA RELATIVA (IMR)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--n-900)', letterSpacing: '-0.02em' }}>
              {plan.realImr}%
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--n-500)', marginLeft: 6 }}>Real</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--n-600)' }}>
              Objetivo: <strong style={{ color: 'var(--n-900)' }}>{plan.targetImr}%</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--n-700)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Desviación Global:</span>
              <strong style={{ color: Math.abs(plan.imrDeviation) <= 0.5 ? 'var(--success)' : 'var(--warning)' }}>
                {plan.imrDeviation > 0 ? `+${plan.imrDeviation}` : plan.imrDeviation}%
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Desv. Máx. Micro:</span>
              <strong style={{ color: 'var(--n-900)' }}>{plan.audit.summary.maxImrDeviation}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Desv. Promedio Micro:</span>
              <strong style={{ color: 'var(--n-900)' }}>{plan.audit.summary.averageImrDeviation}%</strong>
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
              <th>Grupo Metodológico</th>
              <th className="num-cell">% Total Mesociclo</th>
              <th className="num-cell">Repeticiones Teóricas</th>
              <th className="num-cell">Repeticiones Asignadas</th>
              <th className="num-cell">Rendimiento Ref. (kg)</th>
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
                  <td style={{ fontWeight: 700, color: 'var(--n-900)' }}>{ex}</td>
                  <td>
                    <span className={`badge ${isPt ? 'badge-info' : 'badge-neutral'}`} style={{ fontSize: 11 }}>
                      {isPt ? 'Técnica (PT)' : 'Física (PF)'}
                    </span>
                  </td>
                  <td className="num-cell">{(prop * 100).toFixed(2)}%</td>
                  <td className="num-cell" style={{ color: 'var(--n-600)' }}>{theoReps.toFixed(2)}</td>
                  <td className="num-cell" style={{ fontWeight: 800, color: 'var(--daom-blue)', fontSize: 15 }}>{actualReps}</td>
                  <td className="num-cell" style={{ fontWeight: 600 }}>{refKg.toFixed(1)} kg</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
