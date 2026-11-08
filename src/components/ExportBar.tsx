import React from 'react';
import { MesocyclePlan } from '../engine/types';
import { exportPlanToExcel } from '../export/excelExport';
import { triggerPrintPdf } from '../export/pdfExport';
import { savePlan } from '../storage/planStore';
import { FileSpreadsheet, Printer, Save, CheckCircle2 } from 'lucide-react';

interface ExportBarProps {
  plan: MesocyclePlan;
  onPlanSaved?: () => void;
}

export const ExportBar: React.FC<ExportBarProps> = ({ plan, onPlanSaved }) => {
  const [isSavedFeedback, setIsSavedFeedback] = React.useState(false);

  const handleSave = () => {
    savePlan(plan);
    setIsSavedFeedback(true);
    if (onPlanSaved) onPlanSaved();
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  const handleExcel = () => {
    exportPlanToExcel(plan);
  };

  const handlePrintPdf = () => {
    triggerPrintPdf(plan);
  };

  return (
    <div className="daom-card no-print" style={{ marginBottom: 24, padding: '16px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div className="daom-eyebrow" style={{ marginBottom: 2 }}>
            EXPORTACIÓN Y ALMACENAMIENTO
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--n-900)', margin: 0 }}>
            Acciones del Mesociclo
          </h2>
          <p style={{ fontSize: 13, color: 'var(--n-600)', margin: 0 }}>
            Descargá la planificación en formato Excel oficial o generá un PDF listo para imprimir.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* Guardar Local */}
          <button
            onClick={handleSave}
            className={`daom-btn ${isSavedFeedback ? 'badge-success' : 'daom-btn--secondary'}`}
            style={{ fontSize: 13 }}
            title="Guardar mesociclo en el almacenamiento local del dispositivo"
          >
            {isSavedFeedback ? <CheckCircle2 size={16} /> : <Save size={16} />}
            <span>{isSavedFeedback ? '¡Guardado Exitoso!' : 'Guardar Local'}</span>
          </button>

          {/* Exportar a Excel */}
          <button
            onClick={handleExcel}
            className="daom-btn"
            style={{
              backgroundColor: '#107C41',
              color: '#FFFFFF',
              fontSize: 13
            }}
            title="Exportar a archivo Excel .xlsx con 4 hojas analíticas"
          >
            <FileSpreadsheet size={16} />
            <span>Exportar Excel (.xlsx)</span>
          </button>

          {/* Imprimir / PDF */}
          <button
            onClick={handlePrintPdf}
            className="daom-btn daom-btn--primary"
            style={{ fontSize: 13 }}
            title="Generar versión imprimible optimizada para entrenadores de sala"
          >
            <Printer size={16} />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
