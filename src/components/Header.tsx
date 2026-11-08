import React from 'react';
import { Dumbbell, ShieldCheck, FolderKanban, PlusCircle, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenSavedPlans: () => void;
  onNewPlan: () => void;
  onOpenAudit: () => void;
  isAuditPassed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSavedPlans,
  onNewPlan,
  onOpenAudit,
  isAuditPassed
}) => {
  return (
    <header className="daom-card no-print" style={{ marginBottom: 24, padding: '16px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--daom-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Dumbbell size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>
              MÉTODO CUBANO
            </h1>
            <p style={{ fontSize: 13, color: 'var(--daom-text-secondary)', margin: 0 }}>
              Planificador Profesional de Mesociclos de Weightlifting
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={onOpenAudit}
            className="touch-target badge badge-success"
            style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer' }}
            title="Verificar auditoría matemática de volumen e intensidades"
          >
            {isAuditPassed ? <CheckCircle2 size={16} /> : <ShieldCheck size={16} />}
            <span>Auditoría Matemática</span>
          </button>

          <button
            onClick={onOpenSavedPlans}
            className="touch-target"
            style={{
              padding: '8px 14px',
              backgroundColor: 'var(--daom-surface-2)',
              color: 'var(--daom-text-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--daom-border-subtle)',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <FolderKanban size={16} />
            <span>Mis Mesociclos</span>
          </button>

          <button
            onClick={onNewPlan}
            className="touch-target"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--daom-primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <PlusCircle size={16} />
            <span>Nuevo Plan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
