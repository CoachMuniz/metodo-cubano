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
    <div className="daom-modal-backdrop" onClick={onClose}>
      <div className="daom-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 660 }}>
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
              <FolderKanban size={22} />
            </div>
            <div>
              <div className="daom-eyebrow">PERSISTENCIA LOCAL</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--n-900)' }}>
                Mesociclos Guardados
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

        {plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--n-500)', fontSize: 14 }}>
            No hay mesociclos guardados localmente todavía. Creá y guardá uno para verlo aquí.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {plans.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPlan(p.id);
                  onClose();
                }}
                style={{
                  backgroundColor: 'var(--n-50)',
                  border: '1px solid var(--n-200)',
                  borderRadius: 'var(--r-md)',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--n-900)' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--n-600)', marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {p.athleteName && <span>Atleta: <strong style={{ color: 'var(--n-900)' }}>{p.athleteName}</strong></span>}
                    <span>Total: <strong style={{ color: 'var(--n-900)' }}>{p.totalOlympicKg} kg</strong></span>
                    <span>Volumen: <strong style={{ color: 'var(--daom-blue)' }}>{p.totalReps} reps</strong></span>
                    <span>Duración: <strong>{p.durationMicros} micros</strong></span>
                    <span>Fecha: {new Date(p.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={e => handleDelete(p.id, e)}
                    className="daom-btn daom-btn--danger"
                    style={{ padding: '6px 10px', fontSize: 12, minHeight: 36 }}
                    title="Eliminar este mesociclo"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div style={{ color: 'var(--daom-blue)', display: 'flex', alignItems: 'center' }}>
                    <ArrowRightCircle size={22} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--n-200)', paddingTop: 16 }}>
          <button
            onClick={onClose}
            className="daom-btn daom-btn--secondary"
            style={{ fontSize: 14 }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
