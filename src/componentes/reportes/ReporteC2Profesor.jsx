import React from "react";

const ReporteC2Profesor = () => {
  //Estos son los datos quemados, mocks para Rudexy
  const profesores = [
    { nombre: "Santiago Yosa", materia: "Front II", promedio: 4.0 },
    { nombre: "Andrés Llosa", materia: "Back II", promedio: 3.5 },
    { nombre: "Liliana Torres", materia: "Nuevas Tecnologías", promedio: 3.7 },
  ];

  
  const promedioGeneral =
    profesores.reduce((acc, prof) => acc + prof.promedio, 0) / profesores.length;

  return (
    <div className="reporte-c2">
      <h3>Reporte C2 - Notas por Profesor</h3>
      <p>Consulta del promedio de notas por profesor y promedio general.</p>

      {/* KPI (promedio) general */}
      <div className="kpi-container">
        <p>Promedio general de profesores: <strong>{promedioGeneral.toFixed(2)}</strong></p>
      </div>

      {/*datos */}
      <table>
        <thead>
          <tr>
            <th>Profesor</th>
            <th>Materia</th>
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((prof, index) => (
            <tr key={index}>
              <td>{prof.nombre}</td>
              <td>{prof.materia}</td>
              <td>{prof.promedio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteC2Profesor;
