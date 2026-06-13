import React from "react";

const ReporteC1Curso = () => {

  const cursos = [

    { nombre: "Matemáticas", promedio: 4.2, estudiantes: 2.5 },

    { nombre: "Programación", promedio: 4.5, estudiantes: 3.0 },

    { nombre: "Bases de Datos", promedio: 4.0, estudiantes: 2.0 }

  ];

  const promedioGeneral =
  cursos.reduce((acc, curso) => acc + curso.promedio, 0) / cursos.length;


  return (

    <div className="reporte-c1">
      <h3>Reporte C1 - Notas por Curso</h3>

      <p>MODIFICADO PARA PRUEBA DE GIT </p>

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
