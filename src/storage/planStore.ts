import { MesocyclePlan } from '../engine/types';

const STORAGE_KEY_PLANS = 'metodo_cubano_saved_plans_v1';
const STORAGE_KEY_LAST_ACTIVE = 'metodo_cubano_last_active_id_v1';

export interface SavedPlanMeta {
  id: string;
  name: string;
  athleteName?: string;
  createdAt: string;
  totalOlympicKg: number;
  totalReps: number;
  durationMicros: number;
  targetImr: number;
  realImr: number;
}

export function getSavedPlans(): SavedPlanMeta[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    if (!raw) return [];
    const plans: Record<string, MesocyclePlan> = JSON.parse(raw);
    return Object.values(plans)
      .map(p => ({
        id: p.id,
        name: p.name || 'Sin nombre',
        athleteName: p.athleteName,
        createdAt: p.createdAt,
        totalOlympicKg: p.input.totalOlympicKg,
        totalReps: p.totalRepsActual,
        durationMicros: p.input.durationMicros,
        targetImr: p.targetImr,
        realImr: p.realImr
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (e) {
    console.error('Error al cargar planes guardados:', e);
    return [];
  }
}

export function savePlan(plan: MesocyclePlan): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    const plans: Record<string, MesocyclePlan> = raw ? JSON.parse(raw) : {};
    plans[plan.id] = plan;
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
    localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, plan.id);
  } catch (e) {
    console.error('Error al guardar plan:', e);
  }
}

export function loadPlan(id: string): MesocyclePlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    if (!raw) return null;
    const plans: Record<string, MesocyclePlan> = JSON.parse(raw);
    const plan = plans[id] || null;
    if (plan) {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, id);
    }
    return plan;
  } catch (e) {
    console.error('Error al cargar plan:', e);
    return null;
  }
}

export function deletePlan(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    if (!raw) return;
    const plans: Record<string, MesocyclePlan> = JSON.parse(raw);
    delete plans[id];
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
    if (localStorage.getItem(STORAGE_KEY_LAST_ACTIVE) === id) {
      localStorage.removeItem(STORAGE_KEY_LAST_ACTIVE);
    }
  } catch (e) {
    console.error('Error al eliminar plan:', e);
  }
}

export function getLastActivePlanId(): string | null {
  return localStorage.getItem(STORAGE_KEY_LAST_ACTIVE);
}
