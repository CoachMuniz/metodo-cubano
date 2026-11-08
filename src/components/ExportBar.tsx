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
    <div className="daom-card no-print" style={{ marginBottom: 24, padding: '14px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>
            Acciones y Exportación:
          </span>
          <span style={{ fontSize: 12, color: 'var(--daom-text-secondary)' }}>
            Descargá tu planificación en Excel o imprimí/guardá en PDF.
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleSave}
            className="touch-target"
            style={{
              padding: '8px 16px',
              backgroundColor: isSavedFeedback ? 'var(--daom-success)' : 'var(--daom-surface-2)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              border: isSavedFeedback ? '1px solid var(--daom-success)' : '1px solid var(--daom-border-subtle)',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {isSavedFeedback ? <CheckCircle2 size={16} /> : <Save size={16} />}
            <span>{isSavedFeedback ? 'Guardado!' : 'Guardar Local'}</span>
          </button>

          <button
            onClick={handleExcel}
            className="touch-target"
            style={{
              padding: '8px 16px',
              backgroundColor: '#107C41', // Excel brand green
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <FileSpreadsheet size={16} />
            <span>Exportar Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePrintPdf}
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
            <Printer size={16} />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
