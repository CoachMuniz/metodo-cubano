import React, { useState, useEffect } from 'react';
import { UserInputData, MesocyclePlan } from './engine/types';
import { calculateMesocycle } from './engine/calculator';
import { Header } from './components/Header';
import { Step1GeneralData } from './components/Step1GeneralData';
import { Step2MicrocycleAlternatives } from './components/Step2MicrocycleAlternatives';
import { GeneralOverview } from './components/GeneralOverview';
import { MicrocycleView } from './components/MicrocycleView';
import { DailyView } from './components/DailyView';
import { ExportBar } from './components/ExportBar';
import { MathematicalAuditModal } from './components/MathematicalAuditModal';
import { SavedPlansModal } from './components/SavedPlansModal';
import { loadPlan, getLastActivePlanId, savePlan } from './storage/planStore';
import { Edit3, CheckCircle2 } from 'lucide-react';

const DEFAULT_INPUT: UserInputData = {
  totalOlympicKg: 226,
  totalReps: 1250,
  ptPercent: 57,
  snatchInPtPercent: 51,
  squatsInPfPercent: 55,
  snatchPullsInPullsPercent: 55,
  durationMicros: 4,
  selectedAlternativeIndex: 2, // Alternativa 3: -2, -1, +1, +3
  targetMesocycleImr: 67,
  planName: 'Mesociclo de Referencia (ESFAAR)',
  athleteName: 'Facundo Costa'
};

export const App: React.FC = () => {
  const [inputData, setInputData] = useState<UserInputData>(DEFAULT_INPUT);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 4>(4);
  const [activePlan, setActivePlan] = useState<MesocyclePlan | null>(null);

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isSavedPlansModalOpen, setIsSavedPlansModalOpen] = useState(false);

  // Cargar último plan o calcular default inicial
  useEffect(() => {
    const lastId = getLastActivePlanId();
    if (lastId) {
      const plan = loadPlan(lastId);
      if (plan) {
        setActivePlan(plan);
        setInputData(plan.input);
        return;
      }
    }
    // Si no hay plan previo, calcular el predeterminado
    try {
      const initialPlan = calculateMesocycle(DEFAULT_INPUT);
      setActivePlan(initialPlan);
      savePlan(initialPlan);
    } catch (e) {
      console.error('Error calculando plan inicial:', e);
    }
  }, []);

  const handleUpdateInput = (updated: Partial<UserInputData>) => {
    setInputData(prev => ({ ...prev, ...updated }));
  };

  const handleCalculate = () => {
    try {
      const plan = calculateMesocycle(inputData);
      setActivePlan(plan);
      savePlan(plan);
      setCurrentStep(4);
    } catch (e: any) {
      alert(`Error al calcular el mesociclo: ${e.message}`);
    }
  };

  const handleNewPlan = () => {
    setInputData({
      ...DEFAULT_INPUT,
      planName: `Nuevo Mesociclo ${new Date().toLocaleDateString('es-ES')}`
    });
    setCurrentStep(1);
  };

  const handleSelectSavedPlan = (id: string) => {
    const plan = loadPlan(id);
    if (plan) {
      setActivePlan(plan);
      setInputData(plan.input);
      setCurrentStep(4);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px', minHeight: '100vh' }}>
      {/* Header institucional */}
      <Header
        onOpenSavedPlans={() => setIsSavedPlansModalOpen(true)}
        onNewPlan={handleNewPlan}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        isAuditPassed={activePlan?.audit.isVolumeConserved100 ?? false}
      />

      {/* Navegación de Estados / Pasos */}
      {currentStep !== 4 && (
        <div className="daom-card no-print" style={{ marginBottom: 20, padding: '12px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setCurrentStep(1)}
            className={`daom-btn ${currentStep === 1 ? 'daom-btn--primary' : 'daom-btn--secondary'}`}
            style={{ fontSize: 13 }}
          >
            1. Datos del Mesociclo
          </button>

          <span style={{ color: 'var(--n-400)', fontWeight: 700 }}>→</span>

          <button
            onClick={() => setCurrentStep(2)}
            className={`daom-btn ${currentStep === 2 ? 'daom-btn--primary' : 'daom-btn--secondary'}`}
            style={{ fontSize: 13 }}
          >
            2. Selección de Microciclos
          </button>
        </div>
      )}

      {/* Paso 1: Datos Generales */}
      {currentStep === 1 && (
        <Step1GeneralData
          data={inputData}
          onChange={handleUpdateInput}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {/* Paso 2: Microciclos y Alternativas */}
      {currentStep === 2 && (
        <Step2MicrocycleAlternatives
          data={inputData}
          onChange={handleUpdateInput}
          onBack={() => setCurrentStep(1)}
          onCalculate={handleCalculate}
        />
      )}

      {/* Paso 4: Resultados Completos de la Planificación */}
      {currentStep === 4 && activePlan && (
        <div>
          {/* Barra de Modificar Entradas */}
          <div className="daom-card no-print" style={{ marginBottom: 20, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="badge badge-success">
                <CheckCircle2 size={15} />
                <span>Mesociclo Calculado con Éxito</span>
              </span>
              <span style={{ fontSize: 13, color: 'var(--n-600)', fontWeight: 600 }}>
                {activePlan.totalRepsActual} reps | {activePlan.input.durationMicros} micros | IMR: <strong style={{ color: 'var(--n-900)' }}>{activePlan.realImr}%</strong> (Objetivo: {activePlan.targetImr}%)
              </span>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="daom-btn daom-btn--secondary"
              style={{ fontSize: 13 }}
            >
              <Edit3 size={15} />
              <span>Modificar Parámetros y Recalcular</span>
            </button>
          </div>

          {/* Barra de Exportación y Acciones */}
          <ExportBar plan={activePlan} />

          {/* 11.1 Vista General */}
          <GeneralOverview plan={activePlan} />

          {/* 11.2 Vista por Microciclo */}
          <MicrocycleView plan={activePlan} />

          {/* 11.3 Vista Diaria Completa */}
          <DailyView plan={activePlan} />
        </div>
      )}

      {/* Modales */}
      {isAuditModalOpen && activePlan && (
        <MathematicalAuditModal
          plan={activePlan}
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}

      {isSavedPlansModalOpen && (
        <SavedPlansModal
          onClose={() => setIsSavedPlansModalOpen(false)}
          onSelectPlan={handleSelectSavedPlan}
        />
      )}
    </div>
  );
};
