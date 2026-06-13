import React from 'react';
/* import './ReporteC3Estudiante.css'; */

function ReporteC3Estudiante() {
  const estudiante = {
    id: 1001,
    nombre: 'Juan Pérez',
    documento: '1034567890',
    correo: 'juan.perez@sura8.edu.co',
    programa: 'Ingeniería de Sistemas',
    semestre: 5,
    asistencia: '92%',
    estado: 'Aprobado',
    promedio: 4.35,

    materias: [
      {
        materia: 'Matemáticas',
        nota: 4.5
      },
      {
        materia: 'Programación Web',
        nota: 4.8
      },
      {
        materia: 'Bases de Datos',
        nota: 4.2
      },
      {
        materia: 'Inglés',
        nota: 3.9
      },
      {
        materia: 'Arquitectura de Software',
        nota: 4.4
      },
      {
        materia: 'Redes',
        nota: 4.3
      }
    ]
  };

  return (
    <div className="c3-container">

      {/* ENCABEZADO */}
      <div className="c3-header">
        <h2>Reporte Individual de Estudiante</h2>
        <p>Seguimiento académico por estudiante</p>
      </div>

      {/* DATOS GENERALES */}
      <div className="c3-info">

        <div className="c3-info-item">
          <strong>ID:</strong> {estudiante.id}
        </div>

        <div className="c3-info-item">
          <strong>Nombre:</strong> {estudiante.nombre}
        </div>

        <div className="c3-info-item">
          <strong>Documento:</strong> {estudiante.documento}
        </div>

        <div className="c3-info-item">
          <strong>Correo:</strong> {estudiante.correo}
        </div>

        <div className="c3-info-item">
          <strong>Programa:</strong> {estudiante.programa}
        </div>

        <div className="c3-info-item">
          <strong>Semestre:</strong> {estudiante.semestre}
        </div>

      </div>

      {/* KPIs */}
      <div className="c3-kpis">

        <div className="c3-kpi">
          <span className="c3-kpi-label">
            Promedio General
          </span>

          <span className="c3-kpi-value">
            {estudiante.promedio.toFixed(2)}
          </span>
        </div>

        <div className="c3-kpi">
          <span className="c3-kpi-label">
            Asistencia
          </span>

          <span className="c3-kpi-value">
            {estudiante.asistencia}
          </span>
        </div>

        <div className="c3-kpi">
          <span className="c3-kpi-label">
            Estado Académico
          </span>

          <span className="c3-kpi-value">
            {estudiante.estado}
          </span>
        </div>

      </div>

      {/* TABLA DE NOTAS */}
      <div className="c3-table-container">

        <h3>📚 Detalle de Materias</h3>

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