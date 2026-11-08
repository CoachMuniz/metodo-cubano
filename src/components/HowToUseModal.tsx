import React, { useEffect } from 'react';
import { X, HelpCircle, Dumbbell, Sliders } from 'lucide-react';

interface HowToUseModalProps {
  onClose: () => void;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({ onClose }) => {
  // Soporte para cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="daom-modal-backdrop" onClick={onClose}>
      <div
        className="daom-modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 720, maxHeight: '88vh', overflowY: 'auto' }}
      >
        {/* Header del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--n-200)', paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--r-md)',
              backgroundColor: 'var(--daom-blue-soft)',
              color: 'var(--daom-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HelpCircle size={24} />
            </div>
            <div>
              <div className="daom-eyebrow">GUÍA RÁPIDA DE USO</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--n-900)' }}>
                Cómo Usar la Calculadora del Método Cubano
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="daom-btn daom-btn--ghost"
            style={{ padding: 8, minHeight: 'auto', minWidth: 'auto' }}
            title="Cerrar guía (Escape)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Introducción */}
        <div className="daom-alert daom-alert--info" style={{ marginBottom: 20 }}>
          <Dumbbell size={22} style={{ color: 'var(--info)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--info)', marginBottom: 2 }}>
              ¿Qué es esta calculadora?
            </div>
            <div style={{ fontSize: 13, color: 'var(--n-700)', lineHeight: 1.5 }}>
              Automatiza la planificación de mesociclos de Weightlifting según la <strong>metodología oficial de la escuela cubana</strong>. A diferencia de las planillas tradicionales de Excel que pierden repeticiones por redondeos individuales, este sistema utiliza un motor de optimización matemática que <strong>conserva el 100% exacto del volumen planificado</strong>.
            </div>
          </div>
        </div>

        {/* Pasos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {/* Paso 1 */}
          <div style={{
            backgroundColor: 'var(--n-50)',
            border: '1px solid var(--n-200)',
            borderRadius: 'var(--r-md)',
            padding: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: 'var(--daom-blue)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                1
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--n-900)' }}>
                Ingreso de Datos Iniciales (Paso 1)
              </h3>
            </div>
            <ul style={{ paddingLeft: 34, fontSize: 13, color: 'var(--n-700)', lineHeight: 1.6, margin: 0 }}>
              <li>
                <strong>Mejor Total Olímpico (kg):</strong> Ingresá la suma de tu récord en Snatch + Clean & Jerk. La calculadora obtiene automáticamente los rendimientos normativos: Snatch (43%), Clean & Jerk (57%) y Squats (73.2%).
              </li>
              <li>
                <strong>Volumen Total (reps):</strong> Cantidad exacta de repeticiones del mesociclo (ej. 1250 reps).
              </li>
              <li>
                <strong>IMR Objetivo (%):</strong> Intensidad Media Relativa deseada para el mesociclo (ej. 67%). Las tablas oficiales cubanas van del 45% al 80%.
              </li>
              <li>
                <strong>Distribuciones Jerárquicas:</strong> Ajustá la proporción de Preparación Técnica (PT) vs Física (PF) y la distribución interna de ejercicios. Los valores complementarios se calculan solos.
              </li>
            </ul>
          </div>

          {/* Paso 2 */}
          <div style={{
            backgroundColor: 'var(--n-50)',
            border: '1px solid var(--n-200)',
            borderRadius: 'var(--r-md)',
            padding: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: 'var(--daom-blue)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                2
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--n-900)' }}>
                Duración y Alternativa de Carga (Paso 2)
              </h3>
            </div>
            <ul style={{ paddingLeft: 34, fontSize: 13, color: 'var(--n-700)', lineHeight: 1.6, margin: 0 }}>
              <li>
                <strong>Duración:</strong> Seleccioná si el mesociclo durará 2, 3, 4 o 5 microciclos (semanas).
              </li>
              <li>
                <strong>Alternativa Oficial:</strong> Cada opción define una curva de ondulación de volumen (% por semana) y desplazamientos normados de IMR (+1%, -2%, etc.) para regular la fatiga.
              </li>
              <li>
                Tocá <strong>"Calcular Mesociclo Completo"</strong> para generar la planificación final.
              </li>
            </ul>
          </div>

          {/* Paso 3 */}
          <div style={{
            backgroundColor: 'var(--n-50)',
            border: '1px solid var(--n-200)',
            borderRadius: 'var(--r-md)',
            padding: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: 'var(--daom-blue)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                3
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--n-900)' }}>
                Vista Diaria de la Planificación (Resultado)
              </h3>
            </div>
            <ul style={{ paddingLeft: 34, fontSize: 13, color: 'var(--n-700)', lineHeight: 1.6, margin: 0 }}>
              <li>
                <strong>Desglose por Día y Ejercicio:</strong> Se presenta la programación estructurada de lunes a sábado con los ejercicios correspondientes.
              </li>
              <li>
                <strong>Cargas en Barra (kg):</strong> Cada intensidad porcentual indica los kilogramos exactos calculados (redondeados al kilogramo entero según la regla oficial $0.5 \uparrow$) y la cantidad de repeticiones a ejecutar.
              </li>
              <li>
                <strong>Filtros rápidos:</strong> Podés filtrar para ver solo una semana en particular o expandir/colapsar días según lo necesites.
              </li>
            </ul>
          </div>

          {/* Herramientas Extra */}
          <div style={{
            backgroundColor: 'var(--n-100)',
            border: '1px solid var(--n-200)',
            borderRadius: 'var(--r-md)',
            padding: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Sliders size={18} style={{ color: 'var(--daom-blue)' }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--n-900)' }}>
                Herramientas y Acciones Útiles
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: 12, color: 'var(--n-700)' }}>
              <div>
                <strong>• Guardar Local:</strong> Almacena el mesociclo en la memoria de tu dispositivo para abrirlo sin internet.
              </div>
              <div>
                <strong>• Exportar Excel (.xlsx):</strong> Genera una planilla con 4 hojas analíticas lista para compartir.
              </div>
              <div>
                <strong>• Imprimir / PDF:</strong> Diseñado con hoja de estilo optimizada para llevar al gimnasio en papel.
              </div>
              <div>
                <strong>• Auditoría Matemática:</strong> Botón superior para verificar la conservación estricta de las repeticiones.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--n-200)', paddingTop: 16 }}>
          <button
            onClick={onClose}
            className="daom-btn daom-btn--primary"
            style={{ fontSize: 14, padding: '10px 24px' }}
          >
            ¡Entendido, Comenzar!
          </button>
        </div>
      </div>
    </div>
  );
};
