import React from 'react';

export default function ReporteC3Estudiante({ reporteData }) {
  const labels = Array.isArray(reporteData?.labels) ? reporteData.labels : [];
  const values = Array.isArray(reporteData?.values) ? reporteData.values : [];

  return (
    <div className="reporte-slot">
      <div className="reporte-slot-header">
        <h3>{reporteData?.titulo ?? 'Reporte C3 — Estudiante'}</h3>
        <p>Notas por estudiante y promedio por estudiante.</p>
      </div>
      {labels.length ? (
        <table className="reporte-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, index) => (
              <tr key={label || index}>
                <td>{label}</td>
                <td>{values[index] ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="reporte-vacio">No hay datos de estudiante para mostrar.</div>
      )}
    </div>
  );
}
