import React from 'react';
import { UserInputData } from '../engine/types';
import { PERFORMANCE_RATIOS } from '../engine/constants';
import { Dumbbell, Layers, Percent, AlertTriangle } from 'lucide-react';

interface Step1GeneralDataProps {
  data: UserInputData;
  onChange: (updated: Partial<UserInputData>) => void;
  onNext: () => void;
}

export const Step1GeneralData: React.FC<Step1GeneralDataProps> = ({
  data,
  onChange,
  onNext
}) => {
  const totalKg = data.totalOlympicKg || 0;
  const snatchRef = (totalKg * PERFORMANCE_RATIOS.Snatch).toFixed(1);
  const cjRef = (totalKg * PERFORMANCE_RATIOS['Clean & Jerk']).toFixed(1);
  const squatsRef = (totalKg * PERFORMANCE_RATIOS.Squats).toFixed(1);

  const pfCalculated = 100 - data.ptPercent;
  const cjInPtCalculated = 100 - data.snatchInPtPercent;
  const pullsInPfCalculated = 100 - data.squatsInPfPercent;
  const cleanPullsInPullsCalculated = 100 - data.snatchPullsInPullsPercent;

  // Validaciones
  const errors: string[] = [];
  if (data.totalOlympicKg <= 0) errors.push('El Total Olímpico debe ser mayor a 0 kg.');
  if (data.totalReps <= 0) errors.push('El volumen debe ser mayor a 0 repeticiones.');
  if (!Number.isInteger(data.totalReps)) errors.push('El volumen debe ser un número entero.');
  if (!Number.isInteger(data.targetMesocycleImr)) errors.push('La IMR objetivo debe ser un número entero.');
  if (data.targetMesocycleImr < 45 || data.targetMesocycleImr > 80) {
    errors.push('La IMR del mesociclo debe estar dentro del rango normado por las tablas cubanas (45% a 80%).');
  }

  const isValid = errors.length === 0;

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
          <Layers size={22} />
        </div>
        <div>
          <div className="daom-eyebrow">PASO 1 DE 2</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--n-900)' }}>
            Parámetros del Mesociclo
          </h2>
          <p style={{ fontSize: 13, color: 'var(--n-600)', margin: 0 }}>
            Ingresá los datos del levantador y las proporciones jerárquicas del método cubano.
          </p>
        </div>
      </div>

      {/* Identificación */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div>
          <label className="daom-label">
            Nombre del Mesociclo / Plan
          </label>
          <input
            type="text"
            value={data.planName || ''}
            onChange={e => onChange({ planName: e.target.value })}
            placeholder="Ej. Meso 1 - Preparación General"
          />
        </div>

        <div>
          <label className="daom-label">
            Nombre del Atleta
          </label>
          <input
            type="text"
            value={data.athleteName || ''}
            onChange={e => onChange({ athleteName: e.target.value })}
            placeholder="Ej. Facundo Costa"
          />
        </div>
      </div>

      {/* 4.1 Rendimiento Deportivo de Referencia */}
      <div style={{
        backgroundColor: 'var(--n-100)',
        borderRadius: 'var(--r-md)',
        padding: 20,
        marginBottom: 24,
        border: '1px solid var(--n-200)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Dumbbell size={18} style={{ color: 'var(--daom-blue)' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--n-900)' }}>
            4.1 Rendimiento Deportivo de Referencia
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'center' }}>
          <div>
            <label className="daom-label">
              Mejor Total Olímpico (kg) <span style={{ color: 'var(--daom-blue)' }}>*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={data.totalOlympicKg || ''}
              onChange={e => onChange({ totalOlympicKg: parseFloat(e.target.value) || 0 })}
              placeholder="Ej. 226"
            />
            <span className="daom-help">
              Suma de referencia del mejor Snatch + Clean & Jerk competitivo.
            </span>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--n-200)',
            boxShadow: 'var(--sh-sm)'
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--daom-blue)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>
              Rendimientos Normativos Calculados:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--n-700)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Snatch (43.0%):</span>
                <strong style={{ color: 'var(--n-900)' }}>{snatchRef} kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Clean & Jerk (57.0%):</span>
                <strong style={{ color: 'var(--n-900)' }}>{cjRef} kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>• Squats (73.2%):</span>
                <strong style={{ color: 'var(--n-900)' }}>{squatsRef} kg</strong>
              </div>
              <div style={{ color: 'var(--n-500)', fontSize: 11, marginTop: 4 }}>
                * Snatch Pulls utiliza la marca de Snatch y Clean Pulls la de Clean & Jerk.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4.2 Volumen e IMR del Mesociclo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div>
          <label className="daom-label">
            4.2 Volumen Total del Mesociclo (reps) <span style={{ color: 'var(--daom-blue)' }}>*</span>
          </label>
          <input
            type="number"
            min="10"
            step="1"
            value={data.totalReps || ''}
            onChange={e => onChange({ totalReps: parseInt(e.target.value, 10) || 0 })}
            placeholder="Ej. 1250"
          />
          <span className="daom-help">
            Número entero positivo. El motor conservará exactamente este volumen total (cero fugas).
          </span>
        </div>

        <div>
          <label className="daom-label">
            6.2 IMR Objetivo del Mesociclo (%) <span style={{ color: 'var(--daom-blue)' }}>*</span>
          </label>
          <input
            type="number"
            min="45"
            max="80"
            step="1"
            value={data.targetMesocycleImr || ''}
            onChange={e => onChange({ targetMesocycleImr: parseInt(e.target.value, 10) || 0 })}
            placeholder="Ej. 67"
          />
          <span className="daom-help">
            Número entero (sin decimales). Rango normativo en tablas cubanas: 45% a 80%.
          </span>
        </div>
      </div>

      {/* 4.3 y 4.4 Distribuciones Jerárquicas */}
      <div style={{
        backgroundColor: 'var(--n-100)',
        borderRadius: 'var(--r-md)',
        padding: 20,
        marginBottom: 24,
        border: '1px solid var(--n-200)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Percent size={18} style={{ color: 'var(--daom-blue)' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--n-900)' }}>
            4.3 y 4.4 Distribución Jerárquica de Ejercicios
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {/* PT vs PF */}
          <div style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 'var(--r-md)', border: '1px solid var(--n-200)' }}>
            <label className="daom-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Preparación Técnica (PT):</span>
              <span style={{ color: 'var(--daom-blue)' }}>{data.ptPercent}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="90"
              value={data.ptPercent}
              onChange={e => onChange({ ptPercent: parseInt(e.target.value, 10) })}
              style={{ accentColor: 'var(--daom-blue)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--n-600)', marginTop: 6 }}>
              <span>PT: {data.ptPercent}%</span>
              <span>PF (Automático): <strong style={{ color: 'var(--n-900)' }}>{pfCalculated}%</strong></span>
            </div>
          </div>

          {/* Snatch vs Clean & Jerk in PT */}
          <div style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 'var(--r-md)', border: '1px solid var(--n-200)' }}>
            <label className="daom-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Snatch dentro de PT:</span>
              <span style={{ color: 'var(--daom-blue)' }}>{data.snatchInPtPercent}%</span>
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={data.snatchInPtPercent}
              onChange={e => onChange({ snatchInPtPercent: parseInt(e.target.value, 10) })}
              style={{ accentColor: 'var(--daom-blue)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--n-600)', marginTop: 6 }}>
              <span>Snatch: {data.snatchInPtPercent}%</span>
              <span>Clean & Jerk: <strong style={{ color: 'var(--n-900)' }}>{cjInPtCalculated}%</strong></span>
            </div>
          </div>

          {/* Squats vs Pulls in PF */}
          <div style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 'var(--r-md)', border: '1px solid var(--n-200)' }}>
            <label className="daom-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Squats dentro de PF:</span>
              <span style={{ color: 'var(--daom-blue)' }}>{data.squatsInPfPercent}%</span>
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={data.squatsInPfPercent}
              onChange={e => onChange({ squatsInPfPercent: parseInt(e.target.value, 10) })}
              style={{ accentColor: 'var(--daom-blue)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--n-600)', marginTop: 6 }}>
              <span>Squats: {data.squatsInPfPercent}%</span>
              <span>Pulls (Total): <strong style={{ color: 'var(--n-900)' }}>{pullsInPfCalculated}%</strong></span>
            </div>
          </div>

          {/* Snatch Pulls vs Clean Pulls in Pulls */}
          <div style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 'var(--r-md)', border: '1px solid var(--n-200)' }}>
            <label className="daom-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Snatch Pulls dentro de Pulls:</span>
              <span style={{ color: 'var(--daom-blue)' }}>{data.snatchPullsInPullsPercent}%</span>
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={data.snatchPullsInPullsPercent}
              onChange={e => onChange({ snatchPullsInPullsPercent: parseInt(e.target.value, 10) })}
              style={{ accentColor: 'var(--daom-blue)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--n-600)', marginTop: 6 }}>
              <span>Snatch Pulls: {data.snatchPullsInPullsPercent}%</span>
              <span>Clean Pulls: <strong style={{ color: 'var(--n-900)' }}>{cleanPullsInPullsCalculated}%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de Validación (Icono + Texto + Color) */}
      {errors.length > 0 && (
        <div className="daom-alert daom-alert--danger" style={{ marginBottom: 20 }}>
          <AlertTriangle size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: 4 }}>
              Revisá los siguientes campos para continuar:
            </div>
            <ul style={{ paddingLeft: 20, fontSize: 13, color: 'var(--n-700)' }}>
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Botón Siguiente */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="daom-btn daom-btn--primary"
          style={{ fontSize: 14, padding: '12px 28px' }}
        >
          Continuar a Selección de Microciclos →
        </button>
      </div>
    </div>
  );
};
