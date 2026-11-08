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
      <div className="daom-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="daom-eyebrow">PLANIFICACIÓN SEMANAL</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--n-900)' }}>
            11.2 Vista por Microciclo
          </h2>
          <p style={{ fontSize: 13, color: 'var(--n-600)', margin: 0 }}>
            Detalle de volumen, IMR objetivo vs real y variantes algorítmicas seleccionadas.
          </p>
        </div>

        {/* Selector de Microciclo (Pills) */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {plan.microcycles.map((m, idx) => {
            const isSelected = idx === selectedMicroIdx;
            return (
              <button
                key={m.microNumber}
                onClick={() => setSelectedMicroIdx(idx)}
                className={`daom-btn ${isSelected ? 'daom-btn--primary' : 'daom-btn--secondary'}`}
                style={{ padding: '6px 16px', fontSize: 13 }}
              >
                Micro {m.microNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjeta de Resumen del Microciclo Seleccionado */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div style={{ backgroundColor: 'var(--n-100)', padding: 16, borderRadius: 'var(--r-md)', border: '1px solid var(--n-200)' }}>
          <div className="daom-kpi__label">VOLUMEN SEMANAL</div>
          <div className="daom-kpi__value" style={{ marginTop: 4 }}>
            {currentMicro.actualReps} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--n-500)' }}>reps</span>
            <span style={{ fontSize: 13, color: 'var(--daom-blue)', fontWeight: 700, marginLeft: 8 }}>({currentMicro.volumePercent}%)</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--n-100)', padding: 16, borderRadius: 'var(--r-md)', border: '1px solid var(--n-200)' }}>
          <div className="daom-kpi__label">IMR OBJETIVO</div>
          <div className="daom-kpi__value" style={{ marginTop: 4 }}>
            {currentMicro.targetImr}%
            <span style={{ fontSize: 13, color: 'var(--n-500)', fontWeight: 600, marginLeft: 8 }}>
              ({currentMicro.imrDisplacement >= 0 ? `+${currentMicro.imrDisplacement}` : currentMicro.imrDisplacement})
            </span>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--n-100)', padding: 16, borderRadius: 'var(--r-md)', border: '1px solid var(--n-200)' }}>
          <div className="daom-kpi__label">IMR REAL ALCANZADA</div>
          <div className="daom-kpi__value" style={{ marginTop: 4, color: 'var(--success)' }}>
            {currentMicro.realImr}%
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--n-100)', padding: 16, borderRadius: 'var(--r-md)', border: '1px solid var(--n-200)' }}>
          <div className="daom-kpi__label">DESVIACIÓN DE IMR</div>
          <div className="daom-kpi__value" style={{
            marginTop: 4,
            color: Math.abs(currentMicro.realImr - currentMicro.targetImr) <= 0.5 ? 'var(--success)' : 'var(--warning)'
          }}>
            {(currentMicro.realImr - currentMicro.targetImr).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Tabla de Repeticiones por Ejercicio en el Microciclo */}
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--n-900)' }}>
        Repeticiones y Variantes Seleccionadas (Microciclo {currentMicro.microNumber}):
      </h3>
      <div className="table-container" style={{ marginBottom: 24 }}>
        <table>
          <thead>
            <tr>
              <th>Ejercicio</th>
              <th className="num-cell">Repeticiones</th>
              <th>Variante Asignada</th>
              <th className="num-cell">IMR Objetivo</th>
              <th className="num-cell">IMR Real</th>
              <th className="num-cell">Desviación</th>
            </tr>
          </thead>
          <tbody>
            {(['Snatch', 'Clean & Jerk', 'Squats', 'Snatch Pulls', 'Clean Pulls'] as const).map(ex => {
              const exPlan = currentMicro.exercises[ex];
              if (!exPlan) return null;
              return (
                <tr key={ex}>
                  <td style={{ fontWeight: 700, color: 'var(--n-900)' }}>{ex}</td>
                  <td className="num-cell" style={{ fontWeight: 800, color: 'var(--daom-blue)', fontSize: 15 }}>{exPlan.reps}</td>
                  <td>
                    <span className="badge badge-info" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {exPlan.variantCode}
                    </span>
                  </td>
                  <td className="num-cell">{exPlan.targetImr}%</td>
                  <td className="num-cell" style={{ fontWeight: 600 }}>{exPlan.realImr.toFixed(2)}%</td>
                  <td className="num-cell" style={{
                    fontWeight: 600,
                    color: Math.abs(exPlan.imrError) <= 0.5 ? 'var(--success)' : 'var(--warning)'
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
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--n-900)' }}>
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
              <th className="num-cell">Total Semanal</th>
            </tr>
          </thead>
          <tbody>
            {(['Snatch', 'Clean & Jerk', 'Squats', 'Snatch Pulls', 'Clean Pulls'] as const).map(ex => {
              const totalExInMicro = currentMicro.exercises[ex]?.reps || 0;
              return (
                <tr key={ex}>
                  <td style={{ fontWeight: 700, color: 'var(--n-900)' }}>{ex}</td>
                  {currentMicro.days.map(d => {
                    const dex = d.exercises.find(e => e.exercise === ex);
                    const reps = dex?.reps || 0;
                    return (
                      <td key={d.day} style={{ textAlign: 'center', color: reps > 0 ? 'var(--n-900)' : 'var(--n-400)' }}>
                        {reps > 0 ? <strong style={{ color: 'var(--n-900)' }}>{reps}</strong> : '—'}
                      </td>
                    );
                  })}
                  <td className="num-cell" style={{ fontWeight: 800, color: 'var(--daom-blue)', fontSize: 15 }}>
                    {totalExInMicro}
                  </td>
                </tr>
              );
            })}
            <tr style={{ backgroundColor: 'var(--n-100)', fontWeight: 800 }}>
              <td style={{ color: 'var(--n-900)' }}>TOTAL DÍA</td>
              {currentMicro.days.map(d => (
                <td key={d.day} style={{ textAlign: 'center', color: 'var(--daom-blue)', fontWeight: 800 }}>
                  {d.totalReps}
                </td>
              ))}
              <td className="num-cell" style={{ color: 'var(--daom-blue)', fontWeight: 800, fontSize: 15 }}>
                {currentMicro.actualReps}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
