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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div className="daom-card" style={{
        maxWidth: 750,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: 'var(--daom-surface-1)',
        border: '1px solid var(--daom-border-strong)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--daom-border-subtle)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck style={{ color: 'var(--daom-primary)' }} size={24} />
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Auditoría Matemática y Metodológica (AGENTE 5)
              </h2>
              <p style={{ fontSize: 12, color: 'var(--daom-text-secondary)', margin: 0 }}>
                Verificación formal de invariantes matemáticas y conservación de volumen.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="touch-target"
            style={{ backgroundColor: 'transparent', color: 'var(--daom-text-secondary)', padding: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Estado General */}
        <div style={{
          backgroundColor: audit.isVolumeConserved100 ? 'var(--daom-success-bg)' : 'var(--daom-danger-bg)',
          border: `1px solid ${audit.isVolumeConserved100 ? 'var(--daom-success)' : 'var(--daom-danger)'}`,
          borderRadius: 'var(--radius-md)',
          padding: 16,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          {audit.isVolumeConserved100 ? (
            <CheckCircle2 size={28} style={{ color: 'var(--daom-success)', flexShrink: 0 }} />
          ) : (
            <AlertTriangle size={28} style={{ color: 'var(--daom-danger)', flexShrink: 0 }} />
          )}
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#FFFFFF' }}>
              {audit.isVolumeConserved100
                ? 'CONSERVACIÓN EXACTA DEL VOLUMEN VERIFICADA AL 100%'
                : 'DISCREPANCIA DETECTADA EN CONSERVACIÓN DE VOLUMEN'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--daom-text-secondary)', marginTop: 2 }}>
              {audit.isVolumeConserved100
                ? 'El motor matemático garantiza que no se pierde ni crea ninguna repetición en toda la jerarquía.'
                : `Se detectó una desviación neta de ${audit.mesocycleRepsDiff} repeticiones.`}
            </div>
          </div>
        </div>

        {/* Métricas de Invariantes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
          <div style={{ backgroundColor: 'var(--daom-surface-2)', padding: 10, borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--daom-text-secondary)' }}>Target Mesociclo</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>{audit.summary.totalTargetReps}</div>
          </div>
          <div style={{ backgroundColor: 'var(--daom-surface-2)', padding: 10, borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--daom-text-secondary)' }}>Suma Microciclos</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--daom-primary)' }}>{audit.summary.sumMicrocyclesReps}</div>
          </div>
          <div style={{ backgroundColor: 'var(--daom-surface-2)', padding: 10, borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--daom-text-secondary)' }}>Suma Ejercicios</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--daom-primary)' }}>{audit.summary.sumExercisesReps}</div>
          </div>
          <div style={{ backgroundColor: 'var(--daom-surface-2)', padding: 10, borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--daom-text-secondary)' }}>Suma Zonas (Días)</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--daom-primary)' }}>{audit.summary.sumZonesReps}</div>
          </div>
        </div>

        {/* Lista de Verificaciones Formales */}
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 10 }}>
          Lista de Verificaciones Formales:
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {audit.checks.map((chk, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--daom-surface-2)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                borderLeft: `4px solid ${chk.passed ? 'var(--daom-success)' : 'var(--daom-danger)'}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10
              }}
            >
              <div style={{ marginTop: 2 }}>
                {chk.passed ? (
                  <CheckCircle2 size={16} style={{ color: 'var(--daom-success)' }} />
                ) : (
                  <AlertTriangle size={16} style={{ color: 'var(--daom-danger)' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#FFFFFF' }}>{chk.name}</div>
                <div style={{ fontSize: 12, color: 'var(--daom-text-secondary)', marginTop: 2 }}>{chk.message}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--daom-border-subtle)', paddingTop: 14 }}>
          <button
            onClick={onClose}
            className="touch-target"
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--daom-primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: 14
            }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
