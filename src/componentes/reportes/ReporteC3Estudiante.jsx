import React from 'react';
import './ReporteC3Estudiante.css';

function ReporteC3Estudiante() {
  const estudiante = {
    id: 1001,
    nombre: 'Juan Pérez',
    promedio: 4.35,
    materias: [
      { materia: 'Matemáticas', nota: 4.5 },
      { materia: 'Programación Web', nota: 4.8 },
      { materia: 'Bases de Datos', nota: 4.2 },
      { materia: 'Inglés', nota: 3.9 }
    ]
  };

  return (
    <div className="c3-container">

      <div className="c3-header">
        <h2>🎓 Reporte Individual de Estudiante</h2>
        <p>ID: {estudiante.id}</p>
      </div>

      <div className="c3-kpi">
        <span className="c3-kpi-label">Promedio General</span>
        <span className="c3-kpi-value">
          {estudiante.promedio.toFixed(2)}
        </span>
      </div>

      <div className="c3-table-container">
        <table className="c3-table">
          <thead>
            <tr>
              <th>Materia</th>
              <th>Calificación</th>
            </tr>
          </thead>

          <tbody>
            {estudiante.materias.map((item, index) => (
              <tr key={index}>
                <td>{item.materia}</td>
                <td>{item.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ReporteC3Estudiante;