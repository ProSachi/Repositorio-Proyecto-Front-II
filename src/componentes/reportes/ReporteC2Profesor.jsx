import React, { useState } from "react";

const ReporteC2Profesor = () => {
  // mocks para Rud
  const profesores = [
    { nombre: "Santiago Yosa", materia: "Front II", promedio: 4.0 },
    { nombre: "Andrés Llanos", materia: "Back II", promedio: 3.5 },
    { nombre: "Liliana Torres", materia: "Nuevas Tecnologías", promedio: 3.7 },
    { nombre: "Santiago Yosa", materia: "Front I", promedio: 4.5 },
    { nombre: "Andrés Llanos", materia: "Back I", promedio: 4.0 },
    { nombre: "Liliana Torres", materia: "Base de datos", promedio: 3.7 },
  ];

  // comienza el filtro
  const [busqueda, setBusqueda] = useState("");
  // ordenar por estado
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // filtro arriba general (nom y materia)
  const profesoresFiltrados = profesores.filter(
    (prof) =>
      prof.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prof.materia.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Ordenar con click desde los titulos
  const profesoresOrdenados = [...profesoresFiltrados].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.key === "promedio") {
      return sortConfig.direction === "asc"
        ? a.promedio - b.promedio
        : b.promedio - a.promedio;
    } else {
      const valA = a[sortConfig.key].toLowerCase();
      const valB = b[sortConfig.key].toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }
  });

  // filtro para promedio desde titulo
  const promedioGeneral =
    profesoresOrdenados.reduce((acc, prof) => acc + prof.promedio, 0) /
    (profesoresOrdenados.length || 1);

  // Función para manejar click de los titulos (orden)
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div style={{ padding: "1.5rem", backgroundColor: "#f7f9fc", borderRadius: "8px" }}>
      <h3 style={{ color: "#333", marginBottom: "0.5rem" }}>Reporte C2 - Notas por Profesor</h3>
      <p style={{ marginBottom: "1rem", color: "#555" }}>
        Consulta del promedio de notas por profesor y promedio general.
      </p>

      {/* para buscarlos por input */}
      <input
        type="text"
        placeholder="Filtrar por nombre o materia..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          marginBottom: "1rem",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100%",
        }}
      />

      {/* KPI general */}
      <div style={{ marginBottom: "1rem", fontWeight: "bold", color: "#222" }}>
        Promedio general de profesores:{" "}
        <strong style={{ color: "#007bff" }}>{promedioGeneral.toFixed(2)}</strong>
      </div>

      {/* Tabla */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <thead style={{ backgroundColor: "#2185ea86" }}>
          <tr>
            <th
              onClick={() => handleSort("nombre")}
              style={{ cursor: "pointer", padding: "10px", textAlign: "left", borderBottom: "2px solid #ccc" }}
            >
              Profesor {sortConfig.key === "nombre" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              onClick={() => handleSort("materia")}
              style={{ cursor: "pointer", padding: "10px", textAlign: "left", borderBottom: "2px solid #ccc" }}
            >
              Materia {sortConfig.key === "materia" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              onClick={() => handleSort("promedio")}
              style={{ cursor: "pointer", padding: "10px", textAlign: "center", borderBottom: "2px solid #ccc" }}
            >
              Promedio {sortConfig.key === "promedio" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {profesoresOrdenados.map((prof, index) => (
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

