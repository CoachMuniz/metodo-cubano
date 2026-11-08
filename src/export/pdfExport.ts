import { MesocyclePlan } from '../engine/types';

export function triggerPrintPdf(plan: MesocyclePlan): void {
  // Ajustar el título de la página temporalmente para el PDF generado por el navegador
  const originalTitle = document.title;
  const safeName = plan.name || `Mesociclo_${plan.input.durationMicros}M`;
  document.title = `${safeName} — Método Cubano Weightlifting`;

  window.print();

  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
