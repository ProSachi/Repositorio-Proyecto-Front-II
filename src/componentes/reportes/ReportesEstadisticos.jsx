import { useState, useRef } from 'react';
import './Reportes.css';
import ReporteC1Curso from './ReporteC1Curso';
import ReporteC2Profesor from './ReporteC2Profesor';
import ReporteC3Estudiante from './ReporteC3Estudiante';
import ReportesExportActions from './ReportesExportActions';

// 1. Centralizamos la configuración. ¡Fácil de escalar y mantener!
const TABS_CONFIG = [
  { id: 'C1', label: 'Curso', Component: ReporteC1Curso },
  { id: 'C2', label: 'Profesor', Component: ReporteC2Profesor },
  { id: 'C3', label: 'Estudiante', Component: ReporteC3Estudiante },
];

function ReportesEstadisticos() {
  const [tabActiva, setTabActiva] = useState('C1');
  const contenidoRef = useRef(null);

  // Encontramos el componente activo dinámicamente
  const TabComponenteActivo = TABS_CONFIG.find((tab) => tab.id === tabActiva)?.Component;

  return (
    <div className="reportes-container">
      {/* ENCABEZADO */}
      <div className="reportes-header">
        <div>
          <h2>📊 Reportes Estadísticos</h2>
          <p className="reportes-subtitulo">Panel de gestión exclusivo para docentes</p>
        </div>
      </div>

      {/* SUBMENÚ DE NAVEGACIÓN (Generado automáticamente) */}
      <div className="reportes-tabs" style={{ marginTop: 16 }}>
        {TABS_CONFIG.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-btn ${tabActiva === id ? 'tab-activo' : ''}`}
            onClick={() => setTabActiva(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ACCIONES DE EXPORTACIÓN */}
      <ReportesExportActions contenedorRef={contenidoRef} combinacion={tabActiva} />

      {/* VISTA DEL CONTENIDO */}
      <div ref={contenidoRef} className="reportes-contenido" style={{ marginTop: 16 }}>
        {TabComponenteActivo && <TabComponenteActivo />}
      </div>
    </div>
  );
}

export default ReportesEstadisticos;