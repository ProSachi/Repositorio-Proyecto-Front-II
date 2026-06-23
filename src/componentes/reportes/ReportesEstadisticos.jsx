// ====================================
// REPORTES ESTADÍSTICOS - UNIFICADO
// Fusiona ReporAcademicos + ReporAdministrativos
// Solo accesible para rol Profesor
// ====================================

import { useState, useEffect } from 'react';
import './Reportes.css';
import { reporteService } from '../../services/reporteService';
import ReporteC1Curso from './ReporteC1Curso';
import ReporteC2Profesor from './ReporteC2Profesor';
import ReporteC3Estudiante from './ReporteC3Estudiante';
import ReportesExportActions from './ReportesExportActions';

const REPORTE_TABS = [
  { id: 'C1', label: 'Curso' },
  { id: 'C2', label: 'Profesor' },
  { id: 'C3', label: 'Estudiante' },
];

// ── Componente principal ──────────────────────
function ReportesEstadisticos() {
  const [combinacion, setCombinacion] = useState('C1');
  const [reporteActivo, setReporteActivo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarReporte = async () => {
      setCargando(true);
      setError('');

      try {
        const respuesta = await reporteService.buscarPorId(combinacion);
        setReporteActivo(respuesta);
      } catch (err) {
        setError('No se pudieron cargar los datos del reporte activo.');
        setReporteActivo(null);
      } finally {
        setCargando(false);
      }
    };

    cargarReporte();
  }, [combinacion]);

  const renderReporteActivo = () => {
    switch (combinacion) {
      case 'C1':
        return <ReporteC1Curso reporteData={reporteActivo} />;
      case 'C2':
        return <ReporteC2Profesor reporteData={reporteActivo} />;
      case 'C3':
        return <ReporteC3Estudiante reporteData={reporteActivo} />;
      default:
        return null;
    }
  };

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <div>
          <h2>📊 Reportes Estadísticos</h2>
          <p className="reportes-subtitulo">Panel de gestión exclusivo para docentes</p>
        </div>
      </div>

      <div className="reportes-tabs" style={{ marginTop: 16 }}>
        {REPORTE_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${combinacion === tab.id ? 'tab-activo' : ''}`}
            onClick={() => setCombinacion(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className="reportes-error">{error}</div>}

      {cargando ? (
        <div className="cargando-container">
          <div className="spinner-global" />
          <p>Cargando reporte activo...</p>
        </div>
      ) : (
        <>
          <ReportesExportActions reporteData={reporteActivo} />
          <div style={{ marginTop: 16 }}>{renderReporteActivo()}</div>
        </>
      )}
    </div>
  );
}

export default ReportesEstadisticos;
