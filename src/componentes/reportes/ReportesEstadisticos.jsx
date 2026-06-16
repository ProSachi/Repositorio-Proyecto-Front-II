// ====================================
// REPORTES ESTADÍSTICOS - UNIFICADO
// Fusiona ReporAcademicos + ReporAdministrativos
// Solo accesible para rol Profesor
// ====================================

import { useState } from 'react';
import './Reportes.css';
import ReporteC1Curso from './ReporteC1Curso';
import ReporteC2Profesor from './ReporteC2Profesor';
import ReporteC3Estudiante from './ReporteC3Estudiante';

// ── Componente principal ──────────────────────
function ReportesEstadisticos() {
  const [combinacion, setCombinacion] = useState('C1'); // C1 | C2 | C3

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <div>
          <h2>📊 Reportes Estadísticos</h2>
          <p className="reportes-subtitulo">
            Panel de gestión exclusivo para docentes
          </p>
        </div>
      </div>

      <div className="reportes-tabs" style={{ marginTop: 16 }}>
        <button className={`tab-btn ${combinacion === 'C1' ? 'tab-activo' : ''}`} onClick={() => setCombinacion('C1')}>Curso</button>
        <button className={`tab-btn ${combinacion === 'C2' ? 'tab-activo' : ''}`} onClick={() => setCombinacion('C2')}>Profesor</button>
        <button className={`tab-btn ${combinacion === 'C3' ? 'tab-activo' : ''}`} onClick={() => setCombinacion('C3')}>Estudiante</button>
      </div>

      <div style={{ marginTop: 16 }}>
        {combinacion === 'C1' && <ReporteC1Curso />}
        {combinacion === 'C2' && <ReporteC2Profesor />}
        {combinacion === 'C3' && <ReporteC3Estudiante />}
      </div>
    </div>
  );
}

export default ReportesEstadisticos;
