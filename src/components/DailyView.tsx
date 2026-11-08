import React, { useState } from 'react';
import { MesocyclePlan } from '../engine/types';
import { ChevronDown, ChevronRight, Dumbbell, Calendar } from 'lucide-react';

interface DailyViewProps {
  plan: MesocyclePlan;
}

export const DailyView: React.FC<DailyViewProps> = ({ plan }) => {
  // Estado para expandir/colapsar microciclos y días
  const [expandedMicros, setExpandedMicros] = useState<Record<number, boolean>>({ 0: true });
  const [filterMicro, setFilterMicro] = useState<number | 'all'>('all');

  const toggleMicro = (idx: number) => {
    setExpandedMicros(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    plan.microcycles.forEach((_, i) => (all[i] = true));
    setExpandedMicros(all);
  };

  const collapseAll = () => {
    setExpandedMicros({});
  };

  return (
    <div className="daom-card" style={{ marginBottom: 24 }}>
      <div className="daom-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="daom-eyebrow">DISTRIBUCIÓN Y PRESCRIPCIÓN DE CARGAS</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--n-900)' }}>
            11.3 Vista Diaria de la Planificación
          </h2>
          <p style={{ fontSize: 13, color: 'var(--n-600)', margin: 0 }}>
            Desglose analítico: Microciclo → Día → Ejercicio → Cargas en kg y repeticiones.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={filterMicro}
            onChange={e => setFilterMicro(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
            style={{ width: 'auto', minWidth: 160, padding: '6px 12px', fontSize: 13 }}
          >
            <option value="all">Ver Todos los Micros</option>
            {plan.microcycles.map((m, i) => (
              <option key={m.microNumber} value={i}>
                Solo Microciclo {m.microNumber}
              </option>
            ))}
          </select>

          <button
            onClick={expandAll}
            className="daom-btn daom-btn--secondary"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            Expandir Todo
          </button>

          <button
            onClick={collapseAll}
            className="daom-btn daom-btn--secondary"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            Colapsar Todo
          </button>
        </div>
      </div>

      {/* Lista de Microciclos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {plan.microcycles.map((m, mIdx) => {
          if (filterMicro !== 'all' && filterMicro !== mIdx) return null;
          const isExpanded = expandedMicros[mIdx] !== false;

          return (
            <div
              key={m.microNumber}
              style={{
                backgroundColor: 'var(--n-50)',
                borderRadius: 'var(--r-lg)',
                border: '1px solid var(--n-200)',
                overflow: 'hidden'
              }}
            >
              {/* Encabezado del Microciclo */}
              <div
                onClick={() => toggleMicro(mIdx)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 20px',
                  backgroundColor: 'var(--daom-blue-soft)',
                  borderBottom: isExpanded ? '1px solid var(--n-200)' : 'none',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {isExpanded ? <ChevronDown size={20} color="var(--daom-blue)" /> : <ChevronRight size={20} color="var(--daom-blue)" />}
                  <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--daom-blue-dark)' }}>
                    MICROCICLO {m.microNumber}
                  </span>
                  <span className="badge badge-info" style={{ fontSize: 11 }}>
                    {m.volumePercent}% Volumen ({m.actualReps} reps)
                  </span>
                  <span className="badge badge-success" style={{ fontSize: 11 }}>
                    IMR: {m.realImr}% (Objetivo: {m.targetImr}%)
                  </span>
                </div>

                <span style={{ fontSize: 12, color: 'var(--daom-blue-dark)', fontWeight: 600 }}>
                  {isExpanded ? 'Contraer' : 'Expandir'}
                </span>
              </div>

              {/* Contenido expandible del Microciclo */}
              {isExpanded && (
                <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {m.days.map(d => {
                    const activeExercises = d.exercises.filter(ex => ex.reps > 0);
                    if (activeExercises.length === 0) return null;

                    return (
                      <div
                        key={d.day}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: 'var(--r-md)',
                          border: '1px solid var(--n-200)',
                          padding: 18,
                          boxShadow: 'var(--sh-sm)'
                        }}
                      >
                        {/* Cabecera del Día */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '1px solid var(--n-200)',
                          paddingBottom: 10,
                          marginBottom: 14,
                          flexWrap: 'wrap',
                          gap: 8
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Calendar size={16} style={{ color: 'var(--daom-blue)' }} />
                            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--n-900)' }}>
                              MICRO {m.microNumber} — {d.day.toUpperCase()}
                            </span>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--daom-blue)' }}>
                            {d.totalReps} repeticiones totales en el día
                          </span>
                        </div>

                        {/* Ejercicios del Día */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {activeExercises.map(ex => {
                            const activeZones = ex.zones.filter(z => z.reps > 0);

                            return (
                              <div
                                key={ex.exercise}
                                style={{
                                  backgroundColor: 'var(--n-50)',
                                  borderRadius: 'var(--r-md)',
                                  padding: 14,
                                  border: '1px solid var(--n-200)'
                                }}
                              >
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: 10,
                                  flexWrap: 'wrap',
                                  gap: 8
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Dumbbell size={16} style={{ color: 'var(--daom-blue)' }} />
                                    <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--n-900)' }}>
                                      {ex.exercise}
                                    </span>
                                    <span className="badge badge-info" style={{ fontSize: 11 }}>
                                      Var. {ex.variantCode}
                                    </span>
                                  </div>

                                  <div style={{ fontSize: 13, color: 'var(--n-700)' }}>
                                    Ref: <strong>{ex.referenceKg.toFixed(1)} kg</strong> | Total Día: <strong style={{ color: 'var(--daom-blue)' }}>{ex.reps} reps</strong> | IMR: <strong>{ex.realImr.toFixed(1)}%</strong>
                                  </div>
                                </div>

                                {/* Tabla de Prescripción del Ejercicio */}
                                <div className="table-container">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Intensidad Prescrita</th>
                                        <th className="num-cell">Carga Prescrita (kg)</th>
                                        <th className="num-cell">Carga Teórica</th>
                                        <th className="num-cell">Intensidad Efectiva</th>
                                        <th className="num-cell">Repeticiones</th>
                                        <th>Prescripción Rápida en Sala</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {activeZones.map(z => (
                                        <tr key={z.intensityPercent}>
                                          <td style={{ fontWeight: 600 }}>{z.intensityPercent}%</td>
                                          <td className="num-cell" style={{ fontWeight: 800, color: 'var(--n-900)', fontSize: 15 }}>
                                            {z.loadKg} kg
                                          </td>
                                          <td className="num-cell" style={{ color: 'var(--n-500)', fontSize: 12 }}>
                                            {z.theoreticalKg.toFixed(1)} kg
                                          </td>
                                          <td className="num-cell" style={{ color: 'var(--n-600)', fontSize: 12 }}>
                                            {z.effectiveIntensityPercent.toFixed(1)}%
                                          </td>
                                          <td className="num-cell" style={{ fontWeight: 800, color: 'var(--daom-blue)', fontSize: 15 }}>
                                            {z.reps}
                                          </td>
                                          <td style={{ fontWeight: 700, color: 'var(--n-900)' }}>
                                            {ex.exercise} — {z.loadKg} kg × {z.reps} reps
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
