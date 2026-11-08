import React, { useState } from 'react';
import { MesocyclePlan, MicrocyclePlan } from '../engine/types';

interface MicrocycleViewProps {
  plan: MesocyclePlan;
}

export const MicrocycleView: React.FC<MicrocycleViewProps> = ({ plan }) => {
  const [selectedMicroIdx, setSelectedMicroIdx] = useState<number>(0);
  const currentMicro: MicrocyclePlan = plan.microcycles[selectedMicroIdx] || plan.microcycles[0];

  if (!currentMicro) return null;

  return (
    <div className="daom-card" style={{ marginBottom: 24 }}>
      <div className="daom-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            11.2 Vista por Microciclo
          </h2>
          <p style={{ fontSize: 13, color: 'var(--daom-text-secondary)', margin: 0 }}>
            Detalle semanal de volumen, IMR alcanzada y distribución por ejercicios y días.
          </p>
        </div>

        {/* Selector de Microciclo */}
        <div style={{ display: 'flex', gap: 6 }}>
          {plan.microcycles.map((m, idx) => {
            const isSelected = idx === selectedMicroIdx;
            return (
              <button
                key={m.microNumber}
                onClick={() => setSelectedMicroIdx(idx)}
                className="touch-target"
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--daom-primary)' : 'var(--daom-surface-2)',
                  color: isSelected ? '#FFFFFF' : 'var(--daom-text-secondary)',
                  border: isSelected ? '1px solid var(--daom-primary)' : '1px solid var(--daom-border-subtle)',
                  fontWeight: 700,
                  fontSize: 13
                }}
              >
                Micro {m.microNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjeta de Resumen del Microciclo Seleccionado */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        <div style={{ backgroundColor: 'var(--daom-surface-2)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--daom-border-subtle)' }}>
          <div style={{ fontSize: 12, color: 'var(--daom-text-secondary)', fontWeight: 600 }}>Volumen del Microciclo</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
            {currentMicro.actualReps} reps
            <span style={{ fontSize: 12, color: 'var(--daom-primary)', fontWeight: 600, marginLeft: 6 }}>({currentMicro.volumePercent}%)</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--daom-surface-2)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--daom-border-subtle)' }}>
          <div style={{ fontSize: 12, color: 'var(--daom-text-secondary)', fontWeight: 600 }}>IMR Objetivo</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
            {currentMicro.targetImr}%
            <span style={{ fontSize: 12, color: 'var(--daom-text-muted)', marginLeft: 6 }}>
              ({currentMicro.imrDisplacement >= 0 ? `+${currentMicro.imrDisplacement}` : currentMicro.imrDisplacement})
            </span>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--daom-surface-2)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--daom-border-subtle)' }}>
          <div style={{ fontSize: 12, color: 'var(--daom-text-secondary)', fontWeight: 600 }}>IMR Real Alcanzada</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--daom-success)', marginTop: 4 }}>
            {currentMicro.realImr}%
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--daom-surface-2)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--daom-border-subtle)' }}>
          <div style={{ fontSize: 12, color: 'var(--daom-text-secondary)', fontWeight: 600 }}>Desviación de IMR</div>
          <div style={{
            fontSize: 22,
            fontWeight: 800,
            marginTop: 4,
            color: Math.abs(currentMicro.realImr - currentMicro.targetImr) <= 0.5 ? 'var(--daom-success)' : 'var(--daom-warning)'
          }}>
            {(currentMicro.realImr - currentMicro.targetImr).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Tabla de Repeticiones por Ejercicio en el Microciclo */}
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: '#FFFFFF' }}>
        Repeticiones y Variantes Seleccionadas (Microciclo {currentMicro.microNumber}):
      </h3>
      <div className="table-container" style={{ marginBottom: 20 }}>
        <table>
          <thead>
            <tr>
              <th>Ejercicio</th>
              <th style={{ textAlign: 'right' }}>Repeticiones</th>
              <th>Variante Asignada</th>
              <th style={{ textAlign: 'right' }}>IMR Objetivo</th>
              <th style={{ textAlign: 'right' }}>IMR Real</th>
              <th style={{ textAlign: 'right' }}>Desviación</th>
            </tr>
          </thead>
          <tbody>
            {(['Snatch', 'Clean & Jerk', 'Squats', 'Snatch Pulls', 'Clean Pulls'] as const).map(ex => {
              const exPlan = currentMicro.exercises[ex];
              if (!exPlan) return null;
              return (
                <tr key={ex}>
                  <td style={{ fontWeight: 700 }}>{ex}</td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--daom-primary)' }}>{exPlan.reps}</td>
                  <td>
                    <span className="badge badge-info" style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {exPlan.variantCode}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>{exPlan.targetImr}%</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{exPlan.realImr.toFixed(2)}%</td>
                  <td style={{
                    textAlign: 'right',
                    fontWeight: 600,
                    color: Math.abs(exPlan.imrError) <= 0.5 ? 'var(--daom-success)' : 'var(--daom-warning)'
                  }}>
                    {exPlan.imrError > 0 ? `+${exPlan.imrError.toFixed(2)}` : exPlan.imrError.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Distribución Semanal (Lunes a Sábado) */}
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: '#FFFFFF' }}>
        Distribución Diaria de Repeticiones (Lunes a Sábado):
      </h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ejercicio</th>
              {currentMicro.days.map(d => (
                <th key={d.day} style={{ textAlign: 'center' }}>{d.day}</th>
              ))}
              <th style={{ textAlign: 'right' }}>Total Semanal</th>
            </tr>
          </thead>
          <tbody>
            {(['Snatch', 'Clean & Jerk', 'Squats', 'Snatch Pulls', 'Clean Pulls'] as const).map(ex => {
              const totalExInMicro = currentMicro.exercises[ex]?.reps || 0;
              return (
                <tr key={ex}>
                  <td style={{ fontWeight: 700 }}>{ex}</td>
                  {currentMicro.days.map(d => {
                    const dex = d.exercises.find(e => e.exercise === ex);
                    const reps = dex?.reps || 0;
                    return (
                      <td key={d.day} style={{ textAlign: 'center', color: reps > 0 ? '#FFFFFF' : 'var(--daom-text-muted)' }}>
                        {reps > 0 ? <strong>{reps}</strong> : '—'}
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--daom-primary)' }}>
                    {totalExInMicro}
                  </td>
                </tr>
              );
            })}
            <tr style={{ backgroundColor: 'var(--daom-surface-2)', fontWeight: 800 }}>
              <td>TOTAL DÍA</td>
              {currentMicro.days.map(d => (
                <td key={d.day} style={{ textAlign: 'center', color: 'var(--daom-primary)' }}>
                  {d.totalReps}
                </td>
              ))}
              <td style={{ textAlign: 'right', color: 'var(--daom-primary)' }}>
                {currentMicro.actualReps}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
