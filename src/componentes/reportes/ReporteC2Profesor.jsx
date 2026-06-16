import React from "react";

const ReporteC2Profesor = () => {
  // Datos simulados
  const profesores = [
    { nombre: "Santiago Yosa", materia: "Front II", promedio: 4.0 },
    { nombre: "Andrés Llosa", materia: "Back II", promedio: 3.5 },
    { nombre: "Liliana Torres", materia: "Nuevas Tecnologías", promedio: 3.7 },
  ];

  // Promedio general
  const promedioGeneral =
    profesores.reduce((acc, prof) => acc + prof.promedio, 0) / profesores.length;

  return (
    <div style={{ padding: "1.5rem", backgroundColor: "#f7f9fc", borderRadius: "8px" }}>
      <h3 style={{ color: "#333", marginBottom: "0.5rem" }}>Reporte C2 - Notas por Profesor</h3>
      <p style={{ marginBottom: "1rem", color: "#555" }}>
        Consulta del promedio de notas por profesor y promedio general.
      </p>

      {/* KPI general */}
      <div style={{ marginBottom: "1rem", fontWeight: "bold", color: "#222" }}>
        Promedio general de profesores:{" "}
        <strong style={{ color: "#007bff" }}>{promedioGeneral.toFixed(2)}</strong>
      </div>

      {/* Tabla organizada */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <thead style={{ backgroundColor: "#e9ecef" }}>
          <tr>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ccc" }}>
              Profesor
            </th>
            <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ccc" }}>
              Materia
            </th>
            <th style={{ padding: "10px", textAlign: "center", borderBottom: "2px solid #ccc" }}>
              Promedio
            </th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((prof, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff",
              }}
            >
              <td style={{ padding: "10px" }}>{prof.nombre}</td>
              <td style={{ padding: "10px" }}>{prof.materia}</td>
              <td style={{ padding: "10px", textAlign: "center", fontWeight: "bold" }}>
                {prof.promedio}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteC2Profesor;
