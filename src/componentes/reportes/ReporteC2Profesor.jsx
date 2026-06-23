import React from 'react';

export default function ReporteC2Profesor({ reporteData }) {
  const labels = Array.isArray(reporteData?.labels) ? reporteData.labels : [];
  const values = Array.isArray(reporteData?.values) ? reporteData.values : [];

  return (
    <div className="reporte-slot">
      <div className="reporte-slot-header">
        <h3>{reporteData?.titulo ?? 'Reporte C2 — Profesor'}</h3>
        <p>Notas por profesor y promedio por profesor esto si funciona?????.</p>
      </div>
      {labels.length ? (
        <table className="reporte-table">
          <thead>
            <tr>
              <th>Profesor</th>
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
        <div className="reporte-vacio">No hay datos de profesor para mostrar.</div>
      )}
    </div>
  );
}
