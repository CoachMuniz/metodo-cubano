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
    errors.push('La IMR del mesociclo debe estar dentro del rango metodológico habitual (45% a 80%).');
  }

  const isValid = errors.length === 0;

  return (
    <div className="daom-card" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="daom-card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Layers style={{ color: 'var(--daom-primary)' }} size={22} />
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Paso 1: Parámetros del Mesociclo</h2>
          <p style={{ fontSize: 13, color: 'var(--daom-text-secondary)', margin: 0 }}>
            Ingresá los datos del atleta y las distribuciones metodológicas fundamentales.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Identificación */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
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
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
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

      {/* 4.1 Rendimiento Deportivo */}
      <div style={{
        backgroundColor: 'var(--daom-surface-2)',
        borderRadius: 'var(--radius-md)',
        padding: 16,
        marginBottom: 24,
        border: '1px solid var(--daom-border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Dumbbell size={18} style={{ color: 'var(--daom-primary)' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
            4.1 Rendimiento Deportivo de Referencia
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Mejor Total Olímpico (kg) <span style={{ color: 'var(--daom-primary)' }}>*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={data.totalOlympicKg || ''}
              onChange={e => onChange({ totalOlympicKg: parseFloat(e.target.value) || 0 })}
              placeholder="Ej. 226"
            />
            <span style={{ fontSize: 11, color: 'var(--daom-text-muted)' }}>
              Suma del mejor Snatch + Clean & Jerk.
            </span>
          </div>

          <div style={{
            backgroundColor: 'var(--daom-surface-1)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--daom-border-subtle)',
            fontSize: 12
          }}>
            <div style={{ fontWeight: 600, color: 'var(--daom-text-secondary)', marginBottom: 6 }}>
              Rendimientos Calculados Automáticamente:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>• Snatch (43%): <strong>{snatchRef} kg</strong></div>
              <div>• Clean & Jerk (57%): <strong>{cjRef} kg</strong></div>
              <div>• Squats (73.2%): <strong>{squatsRef} kg</strong></div>
              <div style={{ color: 'var(--daom-text-muted)', fontSize: 11 }}>
                Pulls usan las referencias de Snatch y Clean & Jerk respectivamente.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4.2 Volumen e IMR del Mesociclo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            4.2 Volumen Total del Mesociclo (reps) <span style={{ color: 'var(--daom-primary)' }}>*</span>
          </label>
          <input
            type="number"
            min="10"
            step="1"
            value={data.totalReps || ''}
            onChange={e => onChange({ totalReps: parseInt(e.target.value, 10) || 0 })}
            placeholder="Ej. 1250"
          />
          <span style={{ fontSize: 11, color: 'var(--daom-text-muted)' }}>
            Debe ser un número entero positivo. El motor conservará exactamente este volumen.
          </span>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            6.2 IMR Objetivo del Mesociclo (%) <span style={{ color: 'var(--daom-primary)' }}>*</span>
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
          <span style={{ fontSize: 11, color: 'var(--daom-text-muted)' }}>
            Exclusivamente número entero (sin decimales). Rango estándar: 55% - 75%.
          </span>
        </div>
      </div>

      {/* 4.3 y 4.4 Distribuciones Jerárquicas */}
      <div style={{
        backgroundColor: 'var(--daom-surface-2)',
        borderRadius: 'var(--radius-md)',
        padding: 16,
        marginBottom: 24,
        border: '1px solid var(--daom-border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Percent size={18} style={{ color: 'var(--daom-primary)' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
            4.3 y 4.4 Distribución Jerárquica de Ejercicios
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {/* PT vs PF */}
          <div style={{ backgroundColor: 'var(--daom-surface-1)', padding: 14, borderRadius: 'var(--radius-sm)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Preparación Técnica (PT): <strong>{data.ptPercent}%</strong>
            </label>
            <input
              type="range"
              min="10"
              max="90"
              value={data.ptPercent}
              onChange={e => onChange({ ptPercent: parseInt(e.target.value, 10) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--daom-text-secondary)', marginTop: 4 }}>
              <span>PT: {data.ptPercent}%</span>
              <span>PF (Automático): <strong>{pfCalculated}%</strong></span>
            </div>
          </div>

          {/* Snatch vs Clean & Jerk in PT */}
          <div style={{ backgroundColor: 'var(--daom-surface-1)', padding: 14, borderRadius: 'var(--radius-sm)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Snatch dentro de PT: <strong>{data.snatchInPtPercent}%</strong>
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={data.snatchInPtPercent}
              onChange={e => onChange({ snatchInPtPercent: parseInt(e.target.value, 10) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--daom-text-secondary)', marginTop: 4 }}>
              <span>Snatch: {data.snatchInPtPercent}%</span>
              <span>Clean & Jerk: <strong>{cjInPtCalculated}%</strong></span>
            </div>
          </div>

          {/* Squats vs Pulls in PF */}
          <div style={{ backgroundColor: 'var(--daom-surface-1)', padding: 14, borderRadius: 'var(--radius-sm)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Squats dentro de PF: <strong>{data.squatsInPfPercent}%</strong>
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={data.squatsInPfPercent}
              onChange={e => onChange({ squatsInPfPercent: parseInt(e.target.value, 10) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--daom-text-secondary)', marginTop: 4 }}>
              <span>Squats: {data.squatsInPfPercent}%</span>
              <span>Pulls (Total): <strong>{pullsInPfCalculated}%</strong></span>
            </div>
          </div>

          {/* Snatch Pulls vs Clean Pulls in Pulls */}
          <div style={{ backgroundColor: 'var(--daom-surface-1)', padding: 14, borderRadius: 'var(--radius-sm)' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              Snatch Pulls dentro de Pulls: <strong>{data.snatchPullsInPullsPercent}%</strong>
            </label>
            <input
              type="range"
              min="20"
              max="80"
              value={data.snatchPullsInPullsPercent}
              onChange={e => onChange({ snatchPullsInPullsPercent: parseInt(e.target.value, 10) })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--daom-text-secondary)', marginTop: 4 }}>
              <span>Snatch Pulls: {data.snatchPullsInPullsPercent}%</span>
              <span>Clean Pulls: <strong>{cleanPullsInPullsCalculated}%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Errores / Validaciones */}
      {errors.length > 0 && (
        <div style={{
          backgroundColor: 'var(--daom-danger-bg)',
          border: '1px solid var(--daom-danger)',
          borderRadius: 'var(--radius-md)',
          padding: 12,
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--daom-danger)', fontWeight: 600, marginBottom: 4 }}>
            <AlertTriangle size={18} />
            <span>Por favor verificá los siguientes datos:</span>
          </div>
          <ul style={{ paddingLeft: 24, fontSize: 13, color: 'var(--daom-text-secondary)' }}>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* Botón Siguiente */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="touch-target"
          style={{
            backgroundColor: isValid ? 'var(--daom-primary)' : 'var(--daom-surface-3)',
            color: isValid ? '#FFFFFF' : 'var(--daom-text-muted)',
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            fontSize: 15,
            fontWeight: 700,
            cursor: isValid ? 'pointer' : 'not-allowed'
          }}
        >
          Continuar a Selección de Microciclos →
        </button>
      </div>
    </div>
  );
};
