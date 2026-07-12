import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import GraficaBarras from "../graficas/GraficaBarras";
import GraficaTorta from "../graficas/GraficaTorta";
import { profesorService } from "../../services/profesorService";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ReporteC2Profesor = () => {
  const [profesores, setProfesores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // comienza el filtro
  const [busqueda, setBusqueda] = useState("");
  // ordenar por estado
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const cargarProfesores = async () => {
      setCargando(true);
      setError("");
      try {
        const data = await profesorService.listarTodos();
        const profesoresTransformados = (data || []).map((profesor) => ({
          nombre: profesor.nombreCompleto || profesor.nombre || "Sin nombre",
          materia: profesor.areasAsignadas || profesor.especialidad || "Sin materia",
          jornada: profesor.jornada || profesor.jornadaLaboral || "Sin jornada",
          experiencia: profesor.experiencia || profesor.anosExperiencia || "Sin experiencia",
        }));
        setProfesores(profesoresTransformados);
      } catch {
        setError("No se pudieron cargar los profesores. Verifica la conexión con el backend.");
      } finally {
        setCargando(false);
      }
    };

    cargarProfesores();
  }, []);

  // filtro arriba general (nom y materia)
  const profesoresFiltrados = profesores.filter(
    (prof) =>
      prof.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prof.materia.toLowerCase().includes(busqueda.toLowerCase()) ||
      prof.jornada.toLowerCase().includes(busqueda.toLowerCase()) ||
      prof.experiencia.toString().toLowerCase().includes(busqueda.toLowerCase())
  );

  // Ordenar con click desde los titulos
  const profesoresOrdenados = [...profesoresFiltrados].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.key === "experiencia") {
      const expA = parseFloat(a.experiencia) || 0;
      const expB = parseFloat(b.experiencia) || 0;
      return sortConfig.direction === "asc" ? expA - expB : expB - expA;
    } else {
      const valA = a[sortConfig.key].toLowerCase();
      const valB = b[sortConfig.key].toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    }
  });

  // filtro para Experiencia desde titulo
  const promedioGeneral =
    profesoresOrdenados.reduce((acc, prof) => acc + parseFloat(prof.experiencia) || 0, 0) /
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

      {/* filtro general */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ flex: 1, marginRight: "2rem" }}>
          <input
            type="text"
            placeholder="Filtrar por nombre, materia, jornada o experiencia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              marginBottom: "1rem",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "300px",
            }}
          />
        </div>
      </div>


{/* contenedor de gráficas lado a lado */}
<div style={{ display: "flex", justifyContent: "space-around", marginBottom: "1.5rem" }}>
  {/* gráfica de torta */}
  <div style={{ width: "350px" }}>
    {!cargando && !error && profesoresOrdenados.length > 0 && (
      <GraficaTorta profesores={profesoresOrdenados} />
    )}
  </div>

  {/* gráfica de barras más compacta */}
  <div>
    {!cargando && !error && profesoresOrdenados.length > 0 && (
      <GraficaBarras profesores={profesoresOrdenados} />
    )}
  </div>
</div>

      {/* KPI general */}
      <div style={{ marginBottom: "1rem", fontWeight: "bold", color: "#222" }}>
        Promedio general de profesores:{" "}
        <strong style={{ color: "#007bff" }}>{promedioGeneral.toFixed(2)}</strong>
      </div>

      {/* Tabla */}
      {!cargando && !error && (
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
                onClick={() => handleSort("jornada")}
                style={{ cursor: "pointer", padding: "10px", textAlign: "center", borderBottom: "2px solid #ccc" }}
              >
                Jornada {sortConfig.key === "jornada" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                onClick={() => handleSort("experiencia")}
                style={{ cursor: "pointer", padding: "10px", textAlign: "center", borderBottom: "2px solid #ccc" }}
              >
                Experiencia en años {sortConfig.key === "experiencia" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
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
                  {prof.jornada}
                </td>
                <td style={{ padding: "10px", textAlign: "center", fontWeight: "bold" }}>
                  {prof.experiencia}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReporteC2Profesor;

