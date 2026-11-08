import React from 'react';
import { SavedPlanMeta, getSavedPlans, deletePlan } from '../storage/planStore';
import { X, FolderKanban, Trash2, ArrowRightCircle } from 'lucide-react';

interface SavedPlansModalProps {
  onClose: () => void;
  onSelectPlan: (id: string) => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({ onClose, onSelectPlan }) => {
  const [plans, setPlans] = React.useState<SavedPlanMeta[]>([]);

  React.useEffect(() => {
    setPlans(getSavedPlans());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que deseás eliminar este mesociclo?')) {
      deletePlan(id);
      setPlans(getSavedPlans());
    }
  };

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
        maxWidth: 650,
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        backgroundColor: 'var(--daom-surface-1)',
        border: '1px solid var(--daom-border-strong)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--daom-border-subtle)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FolderKanban style={{ color: 'var(--daom-primary)' }} size={22} />
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                Mesociclos Guardados (Almacenamiento Local PWA)
              </h2>
              <p style={{ fontSize: 12, color: 'var(--daom-text-secondary)', margin: 0 }}>
                Consultá y recuperá planificaciones previas sin conexión a internet.
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

        {plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--daom-text-muted)' }}>
            No hay mesociclos guardados localmente todavía. Creá y guardá uno para verlo aquí.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {plans.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPlan(p.id);
                  onClose();
                }}
                style={{
                  backgroundColor: 'var(--daom-surface-2)',
                  border: '1px solid var(--daom-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#FFFFFF' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--daom-text-secondary)', marginTop: 2, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {p.athleteName && <span>Atleta: <strong>{p.athleteName}</strong></span>}
                    <span>Total: <strong>{p.totalOlympicKg} kg</strong></span>
                    <span>Volumen: <strong>{p.totalReps} reps</strong></span>
                    <span>{p.durationMicros} micros</span>
                    <span>IMR: <strong>{p.realImr}%</strong> (Obj: {p.targetImr}%)</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--daom-text-muted)', marginTop: 4 }}>
                    Guardado: {new Date(p.createdAt).toLocaleDateString('es-ES')} {new Date(p.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={(e) => handleDelete(p.id, e)}
                    className="touch-target"
                    title="Eliminar este mesociclo"
                    style={{
                      padding: 8,
                      backgroundColor: 'transparent',
                      color: 'var(--daom-danger)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>

                  <button
                    className="touch-target badge badge-info"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                  >
                    <span>Cargar</span>
                    <ArrowRightCircle size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--daom-border-subtle)', paddingTop: 14, marginTop: 20 }}>
          <button
            onClick={onClose}
            className="touch-target"
            style={{
              padding: '10px 18px',
              backgroundColor: 'var(--daom-surface-2)',
              color: 'var(--daom-text-secondary)',
              border: '1px solid var(--daom-border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: 13
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
