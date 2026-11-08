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
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            11.3 Vista Diaria de la Planificación
          </h2>
          <p style={{ fontSize: 13, color: 'var(--daom-text-secondary)', margin: 0 }}>
            Organización completa: Microciclo → Día → Ejercicio → Cargas en kg y repeticiones.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={filterMicro}
            onChange={e => setFilterMicro(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
            style={{ width: 'auto', minWidth: 150, padding: '6px 12px', fontSize: 13 }}
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
            className="touch-target"
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--daom-surface-2)',
              color: 'var(--daom-text-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid var(--daom-border-subtle)'
            }}
          >
            Expandir Todo
          </button>

          <button
            onClick={collapseAll}
            className="touch-target"
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--daom-surface-2)',
              color: 'var(--daom-text-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid var(--daom-border-subtle)'
            }}
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
                backgroundColor: 'var(--daom-surface-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--daom-border-subtle)',
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
                  backgroundColor: 'var(--daom-surface-3)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <span style={{ fontWeight: 800, fontSize: 16, color: '#FFFFFF' }}>
                    MICROCICLO {m.microNumber}
                  </span>
                  <span className="badge badge-info" style={{ fontSize: 11 }}>
                    {m.volumePercent}% Vol. ({m.actualReps} reps)
                  </span>
                  <span className="badge badge-success" style={{ fontSize: 11 }}>
                    IMR: {m.realImr}% (Obj: {m.targetImr}%)
                  </span>
                </div>

                <span style={{ fontSize: 12, color: 'var(--daom-text-secondary)' }}>
                  {isExpanded ? 'Tocar para contraer' : 'Tocar para expandir'}
                </span>
              </div>

              {/* Contenido expandible del Microciclo */}
              {isExpanded && (
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {m.days.map(d => {
                    // Filtrar solo ejercicios que tienen repeticiones > 0
                    const activeExercises = d.exercises.filter(ex => ex.reps > 0);
                    if (activeExercises.length === 0) return null;

                    return (
                      <div
                        key={d.day}
                        style={{
                          backgroundColor: 'var(--daom-surface-1)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--daom-border-subtle)',
                          padding: 16
                        }}
                      >
                        {/* Cabecera del Día */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '1px solid var(--daom-border-subtle)',
                          paddingBottom: 10,
                          marginBottom: 14
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Calendar size={16} style={{ color: 'var(--daom-primary)' }} />
                            <span style={{ fontWeight: 800, fontSize: 15, color: '#FFFFFF' }}>
                              MICRO {m.microNumber} — {d.day.toUpperCase()}
                            </span>
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--daom-primary)' }}>
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
                                  backgroundColor: 'var(--daom-surface-2)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: 12,
                                  border: '1px solid var(--daom-border-subtle)'
                                }}
                              >
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: 8,
                                  flexWrap: 'wrap',
                                  gap: 6
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Dumbbell size={16} style={{ color: 'var(--daom-primary)' }} />
                                    <span style={{ fontWeight: 700, fontSize: 14, color: '#FFFFFF' }}>
                                      {ex.exercise}
                                    </span>
                                    <span className="badge badge-info" style={{ fontSize: 11 }}>
                                      Var. {ex.variantCode}
                                    </span>
                                  </div>

                                  <div style={{ fontSize: 13, color: 'var(--daom-text-secondary)' }}>
                                    Ref: <strong>{ex.referenceKg.toFixed(1)} kg</strong> | Total Día: <strong style={{ color: '#FFFFFF' }}>{ex.reps} reps</strong> | IMR: <strong>{ex.realImr.toFixed(1)}%</strong>
                                  </div>
                                </div>

                                {/* Tabla de Prescripción del Ejercicio */}
                                <div className="table-container">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Intensidad Prescrita</th>
                                        <th style={{ textAlign: 'center' }}>Carga Prescrita (kg)</th>
                                        <th style={{ textAlign: 'center' }}>Carga Teórica</th>
                                        <th style={{ textAlign: 'center' }}>Intensidad Efectiva</th>
                                        <th style={{ textAlign: 'right' }}>Repeticiones</th>
                                        <th>Prescripción Rápida</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {activeZones.map(z => (
                                        <tr key={z.intensityPercent}>
                                          <td style={{ fontWeight: 600 }}>{z.intensityPercent}%</td>
                                          <td style={{ textAlign: 'center', fontWeight: 800, color: '#FFFFFF', fontSize: 15 }}>
                                            {z.loadKg} kg
                                          </td>
                                          <td style={{ textAlign: 'center', color: 'var(--daom-text-muted)', fontSize: 12 }}>
                                            {z.theoreticalKg.toFixed(1)} kg
                                          </td>
                                          <td style={{ textAlign: 'center', color: 'var(--daom-text-secondary)', fontSize: 12 }}>
                                            {z.effectiveIntensityPercent.toFixed(1)}%
                                          </td>
                                          <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--daom-primary)', fontSize: 15 }}>
                                            {z.reps}
                                          </td>
                                          <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
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
