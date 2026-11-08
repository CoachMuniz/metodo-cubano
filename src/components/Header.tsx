import React from 'react';
import { ShieldCheck, FolderKanban, PlusCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenSavedPlans: () => void;
  onNewPlan: () => void;
  onOpenAudit: () => void;
  onOpenHowToUse: () => void;
  isAuditPassed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSavedPlans,
  onNewPlan,
  onOpenAudit,
  onOpenHowToUse,
  isAuditPassed
}) => {
  return (
    <header
      className="daom-card no-print"
      style={{
        marginBottom: 24,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}
    >
      {/* Bloque de Identidad Oficial DAOM */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        {/* Logo oficial DAOM Weightlifting sobre fondo blanco */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/assets/logos/daom-weightlifting-horizontal-azul.png"
            alt="DAOM Weightlifting"
            style={{
              height: 38,
              width: 'auto',
              minWidth: 140,
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Separador vertical */}
        <div style={{ width: 1, height: 36, backgroundColor: 'var(--n-200)' }} />

        {/* Título de la aplicación */}
        <div>
          <div className="daom-eyebrow">
            SISTEMA MODULAR ANALÍTICO
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--n-900)', margin: 0, letterSpacing: '-0.02em' }}>
            Calculadora Método Cubano
          </h1>
        </div>
      </div>

      {/* Acciones de Navegación */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* ¿Cómo usar? */}
        <button
          onClick={onOpenHowToUse}
          className="daom-btn daom-btn--secondary"
          style={{ fontSize: 13 }}
          title="Ver explicación de cómo funciona y cómo se usa la calculadora"
        >
          <HelpCircle size={16} />
          <span>¿Cómo usar?</span>
        </button>

        {/* Auditoría Matemática en vivo */}
        <button
          onClick={onOpenAudit}
          className={`badge ${isAuditPassed ? 'badge-success' : 'badge-warning'} touch-target`}
          style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', borderRadius: 'var(--r-md)' }}
          title="Verificar auditoría matemática de volumen e intensidades"
        >
          {isAuditPassed ? <CheckCircle2 size={16} /> : <ShieldCheck size={16} />}
          <span>Auditoría Matemática</span>
        </button>

        {/* Mis Mesociclos */}
        <button
          onClick={onOpenSavedPlans}
          className="daom-btn daom-btn--secondary"
          style={{ fontSize: 13 }}
        >
          <FolderKanban size={16} />
          <span>Mis Mesociclos</span>
        </button>

        {/* Nuevo Plan */}
        <button
          onClick={onNewPlan}
          className="daom-btn daom-btn--primary"
          style={{ fontSize: 13 }}
        >
          <PlusCircle size={16} />
          <span>Nuevo Plan</span>
        </button>
      </div>
    </header>
  );
};
