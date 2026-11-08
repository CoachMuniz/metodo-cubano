import React from 'react';
import { UserInputData, DurationOption } from '../engine/types';
import { MICROCYCLE_ALTERNATIVES } from '../engine/constants';
import { Calendar, CheckCircle2, BarChart2 } from 'lucide-react';

interface Step2MicrocycleAlternativesProps {
  data: UserInputData;
  onChange: (updated: Partial<UserInputData>) => void;
  onBack: () => void;
  onCalculate: () => void;
}

export const Step2MicrocycleAlternatives: React.FC<Step2MicrocycleAlternativesProps> = ({
  data,
  onChange,
  onBack,
  onCalculate
}) => {
  const currentDuration = data.durationMicros;
  const alternatives = MICROCYCLE_ALTERNATIVES[currentDuration] || [];
  const selectedIndex = Math.min(data.selectedAlternativeIndex, alternatives.length - 1);

  const durationOptions: DurationOption[] = [2, 3, 4, 5];

  const handleSelectDuration = (d: DurationOption) => {
    onChange({
      durationMicros: d,
      selectedAlternativeIndex: 0
    });
  };

  return (
    <div className="daom-card" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="daom-card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Calendar style={{ color: 'var(--daom-primary)' }} size={22} />
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            Paso 2: Duración y Alternativa de Distribución
          </h2>
          <p style={{ fontSize: 13, color: 'var(--daom-text-secondary)', margin: 0 }}>
            Seleccioná la cantidad de microciclos y la variante oficial de carga e IMR.
          </p>
        </div>
      </div>

      {/* Selector de Duración (Tabs) */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          Cantidad de Microciclos del Mesociclo:
        </label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {durationOptions.map(d => {
            const isSelected = d === currentDuration;
            return (
              <button
                key={d}
                type="button"
                onClick={() => handleSelectDuration(d)}
                className="touch-target"
                style={{
                  flex: 1,
                  minWidth: 100,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--daom-primary)' : 'var(--daom-surface-2)',
                  color: isSelected ? '#FFFFFF' : 'var(--daom-text-secondary)',
                  border: isSelected ? '1px solid var(--daom-primary)' : '1px solid var(--daom-border-subtle)',
                  fontWeight: 700,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
              >
                <BarChart2 size={16} />
                <span>{d} Microciclos</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Alternativas Oficiales */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
          Alternativas Originales del Método Cubano para {currentDuration} Microciclos:
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {alternatives.map((alt, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={alt.id}
                onClick={() => onChange({ selectedAlternativeIndex: idx })}
                style={{
                  backgroundColor: isSelected ? 'var(--daom-surface-hover)' : 'var(--daom-surface-2)',
                  border: isSelected ? '2px solid var(--daom-primary)' : '1px solid var(--daom-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      border: isSelected ? '2px solid var(--daom-primary)' : '2px solid var(--daom-border-strong)',
                      backgroundColor: isSelected ? 'var(--daom-primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      {isSelected && <CheckCircle2 size={16} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#FFFFFF' }}>
                        {alt.label}
                      </div>
                      {alt.description && (
                        <div style={{ fontSize: 12, color: 'var(--daom-text-secondary)', marginTop: 2 }}>
                          {alt.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="badge badge-info" style={{ fontSize: 11 }}>
                    Alternativa {alt.id}
                  </span>
                </div>

                {/* Gráfico visual de distribución por microciclos */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${alt.volumePercentages.length}, 1fr)`,
                  gap: 8,
                  marginTop: 12,
                  backgroundColor: 'var(--daom-surface-1)',
                  padding: 12,
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {alt.volumePercentages.map((pct, mIdx) => {
                    const disp = alt.imrDisplacements[mIdx];
                    const targetMicroImr = data.targetMesocycleImr + disp;
                    const approxReps = Math.round((data.totalReps * pct) / 100);

                    return (
                      <div key={mIdx} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--daom-text-secondary)' }}>
                          Micro {mIdx + 1}
                        </div>
                        <div style={{
                          height: 8,
                          backgroundColor: 'var(--daom-surface-3)',
                          borderRadius: 4,
                          margin: '6px 0',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(pct / 45) * 100}%`,
                            height: '100%',
                            backgroundColor: isSelected ? 'var(--daom-primary)' : 'var(--daom-text-muted)',
                            borderRadius: 4
                          }} />
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                          {pct}%
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--daom-text-secondary)' }}>
                          ~{approxReps} reps
                        </div>
                        <div style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: disp > 0 ? 'var(--daom-success)' : disp < 0 ? 'var(--daom-warning)' : 'var(--daom-text-muted)',
                          marginTop: 4
                        }}>
                          IMR: {targetMicroImr}% ({disp >= 0 ? `+${disp}` : disp})
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones de Navegación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          className="touch-target"
          style={{
            backgroundColor: 'var(--daom-surface-2)',
            color: 'var(--daom-text-secondary)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--daom-border-subtle)',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          ← Volver a Datos
        </button>

        <button
          onClick={onCalculate}
          className="touch-target"
          style={{
            backgroundColor: 'var(--daom-primary)',
            color: '#FFFFFF',
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            fontSize: 15,
            fontWeight: 700
          }}
        >
          Calcular Mesociclo Completo ⚡
        </button>
      </div>
    </div>
  );
};
