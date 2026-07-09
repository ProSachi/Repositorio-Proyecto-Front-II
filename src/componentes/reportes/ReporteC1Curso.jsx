import React, { useEffect, useState } from "react";
import "./ReporteC1Curso.css";
import { cursoService } from "../../services/cursoService";

const ReporteC1Curso = () => {
  const [busqueda, setBusqueda] = useState("");
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCursos = async () => {
      setCargando(true);
      setError("");
      try {
        const data = await cursoService.listarTodos();
        const cursosTransformados = (data || []).map((curso) => ({
          nombre: curso.titulo || curso.nombre || "Sin nombre",
          promedio: Number(curso.calificacion) || 0,
          estudiantes: Number(curso.estudiantes) || 0,
        }));
        setCursos(cursosTransformados);
      } catch {
        setError("No se pudieron cargar los cursos. Verifica la conexión con el backend.");
      } finally {
        setCargando(false);
      }
    };

    cargarCursos();
  }, []);

  // FILTRO (búsqueda por nombre)
  const cursosFiltrados = cursos.filter((curso) =>
    curso.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // PROMEDIO GENERAL SOLO DE LOS FILTRADOS
  const promedioGeneral =
    cursosFiltrados.reduce((acc, curso) => acc + curso.promedio, 0) /
    cursosFiltrados.length || 0;

  return (
    <div className="reporte-c1">
      {/* ENCABEZADO */}
      <div className="reporte-c1-header">
        <h2>Reporte C1 - Notas por Curso</h2>
        <p>
          Este reporte muestra el rendimiento académico de los cursos registrados
          en el sistema.
        </p>
      </div>

      {/* FILTRO */}
      <div className="reporte-c1-filtros">
        <input
          type="text"
          placeholder="Buscar curso..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="reporte-c1-input"
        />
      </div>

      {/* TABLA */}
      <div className="tabla-container">
        {cargando && <p>Cargando cursos...</p>}
        {error && <p>{error}</p>}

        {!cargando && !error && (
        <table className="tabla-cursos">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Promedio</th>
              <th>Estudiantes</th>
            </tr>
          </thead>

          <tbody>
            {cursosFiltrados.map((curso, index) => (
              <tr key={index}>
                <td>{curso.nombre}</td>
                <td>{curso.promedio.toFixed(2)}</td>
                <td>{curso.estudiantes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* PROMEDIO GENERAL */}
      <p className="promedio-general">
        <strong>Promedio general:</strong> {promedioGeneral.toFixed(2)}
      </p>

      {/* ESPERANDO INTEGRACIÓN */}
    </div>
  );
};

export default ReporteC1Curso;