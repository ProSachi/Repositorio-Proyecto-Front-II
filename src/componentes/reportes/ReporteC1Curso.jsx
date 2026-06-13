import React from "react";



const ReporteC1Curso = () => {

  const cursos = [

    { nombre: "Matemáticas", promedio: 4.2, estudiantes: 25 },

    { nombre: "Programación", promedio: 4.5, estudiantes: 30 },

    { nombre: "Bases de Datos", promedio: 4.0, estudiantes: 20 }

  ];



  return (

    <div className="reporte-c1">
  <h3>Reporte C1 - Notas por Curso</h3>

  <p>Consulta preliminar de notas por curso.</p>

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



      {/* Esperando integración con servidor */}

    </div>

  );

};



export default ReporteC1Curso;
