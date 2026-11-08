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
    <div className="daom-card" style={{ maxWidth: 960, margin: '0 auto 24px auto' }}>
      <div className="daom-card-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--r-md)',
          backgroundColor: 'var(--daom-blue-soft)',
          color: 'var(--daom-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Calendar size={22} />
        </div>
        <div>
          <div className="daom-eyebrow">PASO 2 DE 2</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--n-900)' }}>
            Duración y Alternativa de Microciclos
          </h2>
          <p style={{ fontSize: 13, color: 'var(--n-600)', margin: 0 }}>
            Elegí la duración del mesociclo y la dinámica oficial de volumen y desplazamientos de IMR.
          </p>
        </div>
      </div>

      {/* Selector de Duración (Tabs) */}
      <div style={{ marginBottom: 24 }}>
        <label className="daom-label">
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
                className={`daom-btn ${isSelected ? 'daom-btn--primary' : 'daom-btn--secondary'}`}
                style={{
                  flex: 1,
                  minWidth: 120,
                  fontSize: 14
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
        <label className="daom-label" style={{ marginBottom: 12 }}>
          Alternativas Originales del Método Cubano para {currentDuration} Microciclos:
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {alternatives.map((alt, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={alt.id}
                onClick={() => onChange({ selectedAlternativeIndex: idx })}
                style={{
                  backgroundColor: isSelected ? '#FFFFFF' : 'var(--n-50)',
                  border: isSelected ? '2px solid var(--daom-blue)' : '1px solid var(--n-200)',
                  borderRadius: 'var(--r-lg)',
                  padding: '18px 20px',
                  cursor: 'pointer',
                  boxShadow: isSelected ? 'var(--sh-md)' : 'var(--sh-sm)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: isSelected ? '2px solid var(--daom-blue)' : '2px solid var(--n-300)',
                      backgroundColor: isSelected ? 'var(--daom-blue)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      {isSelected && <CheckCircle2 size={16} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--n-900)' }}>
                        {alt.label}
                      </div>
                      {alt.description && (
                        <div style={{ fontSize: 13, color: 'var(--n-600)', marginTop: 2 }}>
                          {alt.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className={`badge ${isSelected ? 'badge-info' : 'badge-neutral'}`}>
                    Alternativa {alt.id} {isSelected ? '• Seleccionada' : ''}
                  </span>
                </div>

                {/* Gráfico visual de distribución por microciclos */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${alt.volumePercentages.length}, 1fr)`,
                  gap: 10,
                  backgroundColor: isSelected ? 'var(--daom-blue-soft)' : '#FFFFFF',
                  padding: '14px 16px',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--n-200)'
                }}>
                  {alt.volumePercentages.map((pct, mIdx) => {
                    const disp = alt.imrDisplacements[mIdx];
                    const targetMicroImr = data.targetMesocycleImr + disp;
                    const approxReps = Math.round((data.totalReps * pct) / 100);

                    return (
                      <div key={mIdx} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--n-700)' }}>
                          Micro {mIdx + 1}
                        </div>
                        <div style={{
                          height: 8,
                          backgroundColor: 'var(--n-200)',
                          borderRadius: 4,
                          margin: '8px 0',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(pct / 45) * 100}%`,
                            height: '100%',
                            backgroundColor: isSelected ? 'var(--daom-blue)' : 'var(--n-400)',
                            borderRadius: 4
                          }} />
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--n-900)' }}>
                          {pct}%
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--n-600)' }}>
                          ~{approxReps} reps
                        </div>
                        <div style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: disp > 0 ? 'var(--success)' : disp < 0 ? 'var(--warning)' : 'var(--n-600)',
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
          className="daom-btn daom-btn--secondary"
          style={{ fontSize: 14 }}
        >
          ← Volver a Datos
        </button>

        <button
          onClick={onCalculate}
          className="daom-btn daom-btn--primary"
          style={{ fontSize: 14, padding: '12px 28px' }}
        >
          Calcular Mesociclo Completo ⚡
        </button>
      </div>
    </div>
  );
};
