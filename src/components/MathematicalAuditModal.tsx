import React from 'react';
import { MesocyclePlan } from '../engine/types';
import { X, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MathematicalAuditModalProps {
  plan: MesocyclePlan;
  onClose: () => void;
}

export const MathematicalAuditModal: React.FC<MathematicalAuditModalProps> = ({ plan, onClose }) => {
  const audit = plan.audit;

  return (
    <div className="daom-modal-backdrop" onClick={onClose}>
      <div className="daom-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 740 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--n-200)', paddingBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="daom-eyebrow">AUDITORÍA METODOLÓGICA Y FORMAL</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--n-900)' }}>
                Verificación de Invariantes
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="daom-btn daom-btn--ghost"
            style={{ padding: 8, minHeight: 'auto', minWidth: 'auto' }}
            title="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Estado General */}
        <div className={`daom-alert ${audit.isVolumeConserved100 ? 'daom-alert--success' : 'daom-alert--danger'}`} style={{ marginBottom: 20 }}>
          {audit.isVolumeConserved100 ? (
            <CheckCircle2 size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
          ) : (
            <AlertTriangle size={24} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          )}
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: audit.isVolumeConserved100 ? 'var(--success)' : 'var(--danger)' }}>
              {audit.isVolumeConserved100
                ? 'CONSERVACIÓN EXACTA DEL VOLUMEN VERIFICADA AL 100%'
                : 'DISCREPANCIA DETECTADA EN CONSERVACIÓN DE VOLUMEN'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--n-700)', marginTop: 2 }}>
              {audit.isVolumeConserved100
                ? 'El algoritmo biproporcional de Hamilton garantiza que la suma de microciclos, ejercicios, días y zonas coincide rigurosamente con el volumen total prescripto.'
                : `Se detectó una desviación neta de ${audit.mesocycleRepsDiff} repeticiones.`}
            </div>
          </div>
        </div>

        {/* Métricas de Invariantes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          <div style={{ backgroundColor: 'var(--n-100)', padding: 12, borderRadius: 'var(--r-md)', textAlign: 'center', border: '1px solid var(--n-200)' }}>
            <div style={{ fontSize: 11, color: 'var(--n-600)', fontWeight: 700 }}>Target Mesociclo</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--n-900)', marginTop: 2 }}>{audit.summary.totalTargetReps}</div>
          </div>
          <div style={{ backgroundColor: 'var(--n-100)', padding: 12, borderRadius: 'var(--r-md)', textAlign: 'center', border: '1px solid var(--n-200)' }}>
            <div style={{ fontSize: 11, color: 'var(--n-600)', fontWeight: 700 }}>Suma Microciclos</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--daom-blue)', marginTop: 2 }}>{audit.summary.sumMicrocyclesReps}</div>
          </div>
          <div style={{ backgroundColor: 'var(--n-100)', padding: 12, borderRadius: 'var(--r-md)', textAlign: 'center', border: '1px solid var(--n-200)' }}>
            <div style={{ fontSize: 11, color: 'var(--n-600)', fontWeight: 700 }}>Suma Ejercicios</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--daom-blue)', marginTop: 2 }}>{audit.summary.sumExercisesReps}</div>
          </div>
          <div style={{ backgroundColor: 'var(--n-100)', padding: 12, borderRadius: 'var(--r-md)', textAlign: 'center', border: '1px solid var(--n-200)' }}>
            <div style={{ fontSize: 11, color: 'var(--n-600)', fontWeight: 700 }}>Suma Zonas (Días)</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--daom-blue)', marginTop: 2 }}>{audit.summary.sumZonesReps}</div>
          </div>
        </div>

        {/* Lista de Verificaciones Formales */}
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--n-900)', marginBottom: 12 }}>
          Comprobación Algorítmica de los 8 Invariantes:
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {audit.checks.map((chk, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--n-50)',
                padding: '12px 16px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--n-200)',
                borderLeft: `4px solid ${chk.passed ? 'var(--success)' : 'var(--danger)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }}
            >
              <div style={{ marginTop: 2 }}>
                {chk.passed ? (
                  <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                ) : (
                  <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--n-900)' }}>{chk.name}</div>
                <div style={{ fontSize: 12, color: 'var(--n-600)', marginTop: 2 }}>{chk.message}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--n-200)', paddingTop: 16 }}>
          <button
            onClick={onClose}
            className="daom-btn daom-btn--primary"
            style={{ fontSize: 14, padding: '10px 24px' }}
          >
            Cerrar Auditoría
          </button>
        </div>
      </div>
    </div>
  );
};
