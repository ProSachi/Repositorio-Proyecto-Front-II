import React from "react";

const ReporteC1Curso = () => {

  const cursos = [
  { nombre: "Matemáticas Avanzadas", promedio: 4.6, estudiantes: 28 },
  { nombre: "Programación Web", promedio: 4.8, estudiantes: 35 },
  { nombre: "Bases de Datos SQL", promedio: 4.3, estudiantes: 22 }
];

  const promedioGeneral =
  cursos.reduce((acc, curso) => acc + curso.promedio, 0) / cursos.length;


  return (

    <div className="reporte-c1">
      <h3>Reporte C1 - Notas por Curso</h3>

     <p>Este reporte muestra el rendimiento académico de los cursos registrados en el sistema.</p>

      <table>
         

        <thead>

          <tr>

            <th>Curso</th>

            <th>Promedio</th>

            <th>Estudiantes</th>

          </tr>

        </thead>

        <tbody>

          {cursos.map((curso, index) => (

            <tr key={index}>

              <td>{curso.nombre}</td>

              <td>{curso.promedio}</td>

              <td>{curso.estudiantes}</td>

            </tr>

          ))}

        </tbody>

      </table>

      <p>
  <strong>Promedio general:</strong> {promedioGeneral.toFixed(2)}
</p>


      {/* Esperando integración con servidor Ruddexy */}

    </div>

  );

};



export default ReporteC1Curso;
