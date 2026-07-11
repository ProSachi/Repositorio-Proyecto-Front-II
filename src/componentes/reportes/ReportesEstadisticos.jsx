// ====================================
// REPORTES ESTADÍSTICOS - UNIFICADO
// Fusiona ReporAcademicos + ReporAdministrativos
// Solo accesible para rol Profesor
// ====================================


import React from 'react';
import './Reportes.css';
import ReporteC1Curso from './ReporteC1Curso';
import ReporteC2Profesor from './ReporteC2Profesor';
import ReporteC3Estudiante from './ReporteC3Estudiante';
import ReportesExportActions from './ReportesExportActions';


const ReportesEstadisticos = () => {
  const [tabActiva, setTabActiva] = React.useState('C1');
  const contenidoRef = React.useRef(null);

  return (
    <div className="reportes-container">
      {/* 1. ENCABEZADO */}
      <div className="reportes-header">
        <div>
          <h2>📊 Reportes Estadísticos</h2>
          <p className="reportes-subtitulo">Panel de gestión exclusivo para docentes</p>
        </div>
      </div>

      {/* 2. SUBMENÚ DE NAVEGACIÓN */}
      <div className="reportes-tabs" style={{ marginTop: 16 }}>
        <button
          className={`tab-btn ${tabActiva === 'C1' ? 'tab-activo' : ''}`}
          onClick={() => setTabActiva('C1')}
        >
          Curso
        </button>

        <button
          className={`tab-btn ${tabActiva === 'C2' ? 'tab-activo' : ''}`}
          onClick={() => setTabActiva('C2')}
        >
          Profesor
        </button>

        <button
          className={`tab-btn ${tabActiva === 'C3' ? 'tab-activo' : ''}`}
          onClick={() => setTabActiva('C3')}
        >
          Estudiante
        </button>
      </div>

      <ReportesExportActions contenedorRef={contenidoRef} combinacion={tabActiva} />

      {/* 3. VISTA DEL CONTENIDO (Se muestra uno a la vez) */}
      <div ref={contenidoRef} className="reportes-contenido" style={{ marginTop: 16 }}>
        {tabActiva === 'C1' && <ReporteC1Curso />}
        {tabActiva === 'C2' && <ReporteC2Profesor />}
        {tabActiva === 'C3' && <ReporteC3Estudiante />}
      </div>
    </div>

    
  )
}

export default ReportesEstadisticos
