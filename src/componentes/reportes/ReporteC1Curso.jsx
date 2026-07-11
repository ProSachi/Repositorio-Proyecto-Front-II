import React, { useEffect, useState } from "react";
import "./ReporteC1Curso.css";
import { cursoService } from "../../services/cursoService";

const ReporteC1Curso = () => {

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroNivel, setFiltroNivel] = useState("Todos");
  const [ordenPromedio, setOrdenPromedio] = useState("Ninguno");

  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const cargarCursos = async () => {

      setCargando(true);
      setError("");

      try {

        const data = await cursoService.listarTodos();

        const cursosTransformados = (data || []).map((curso, index) => {

          const promedio = Number(
            curso.calificacion ??
            curso.promedio ??
            curso.nota ??
            0
          );

          return {
            id: curso.id ?? index + 1,
            nombre: curso.titulo || curso.nombre || "Sin nombre",
            categoria: curso.categoria || "General",
            instructor: curso.instructor || curso.docente || "Sin asignar",
            nivel: curso.nivel || "Básico",
            estudiantes: Number(curso.estudiantes ?? 0),
            promedio,
            estado:
              curso.estado ||
              (promedio >= 4.5
                ? "Excelente"
                : promedio >= 3
                ? "Activo"
                : "En seguimiento")
          };

        });

        setCursos(cursosTransformados);

      } catch {

        setError("No fue posible cargar la información de los cursos.");

      } finally {

        setCargando(false);

      }

    };

    cargarCursos();

  }, []);

  const categoriasDisponibles = [
    ...new Set(cursos.map((curso) => curso.categoria).filter(Boolean))
  ];

  const nivelesDisponibles = [
    ...new Set(cursos.map((curso) => curso.nivel).filter(Boolean))
  ];

  const cursosFiltrados = cursos
    .filter((curso) => {

      const coincideBusqueda =
        curso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        curso.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
        curso.instructor.toLowerCase().includes(busqueda.toLowerCase());

      const coincideEstado =
        filtroEstado === "Todos" ||
        curso.estado === filtroEstado;

      const coincideCategoria =
        filtroCategoria === "Todas" ||
        curso.categoria === filtroCategoria;

      const coincideNivel =
        filtroNivel === "Todos" ||
        curso.nivel === filtroNivel;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideCategoria &&
        coincideNivel
      );

    })
    .sort((a, b) => {

      if (ordenPromedio === "Mayor") {
        return b.promedio - a.promedio;
      }

      if (ordenPromedio === "Menor") {
        return a.promedio - b.promedio;
      }

      return 0;

    });

  const promedioGeneral =
    cursosFiltrados.length > 0
      ? cursosFiltrados.reduce(
          (total, curso) => total + curso.promedio,
          0
        ) / cursosFiltrados.length
      : 0;

  const totalEstudiantes = cursosFiltrados.reduce(
    (total, curso) => total + curso.estudiantes,
    0
  );

  const mejorCurso =
    cursosFiltrados.length > 0
      ? cursosFiltrados.reduce((a, b) =>
          a.promedio > b.promedio ? a : b
        )
      : null;

  return (

    <div className="reporte-c1">

      <div className="reporte-c1-header">

        <h2>Reporte C1 - Cursos</h2>

        <p>
          Consulta la información académica de los cursos registrados en la plataforma.
        </p>

      </div>

      <div className="reporte-c1-filtros">

        <input
          type="text"
          placeholder="Buscar curso, categoría o instructor"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="reporte-c1-input"
        />

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Excelente">Excelente</option>
          <option value="Activo">Activo</option>
          <option value="En seguimiento">En seguimiento</option>
        </select>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="Todas">Todas las categorías</option>

          {categoriasDisponibles.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>

        <select
          value={filtroNivel}
          onChange={(e) => setFiltroNivel(e.target.value)}
        >
          <option value="Todos">Todos los niveles</option>

          {nivelesDisponibles.map((nivel) => (
            <option key={nivel} value={nivel}>
              {nivel}
            </option>
          ))}
        </select>

        <select
          value={ordenPromedio}
          onChange={(e) => setOrdenPromedio(e.target.value)}
        >
          <option value="Ninguno">Ordenar promedio</option>
          <option value="Mayor">Mayor a menor</option>
          <option value="Menor">Menor a mayor</option>
        </select>

      </div>

      <div className="informacion-reporte">

        <p><strong>Total de cursos:</strong> {cursosFiltrados.length}</p>

        <p><strong>Total de estudiantes:</strong> {totalEstudiantes}</p>

        <p><strong>Promedio general:</strong> {promedioGeneral.toFixed(2)}</p>

        <p>
          <strong>Curso destacado:</strong>{" "}
          {mejorCurso ? mejorCurso.nombre : "Sin información"}
        </p>

      </div>

            <div className="tabla-container">

        {cargando && (
          <p className="mensaje-cargando">
            Cargando cursos...
          </p>
        )}

        {error && (
          <p className="mensaje-error">
            {error}
          </p>
        )}

        {!cargando && !error && (

          <table className="tabla-cursos">

            <thead>

              <tr>
                <th>ID</th>
                <th>Curso</th>
                <th>Categoría</th>
                <th>Instructor</th>
                <th>Nivel</th>
                <th>Estudiantes</th>
                <th>Promedio</th>
                <th>Estado</th>
              </tr>

            </thead>

            <tbody>

              {cursosFiltrados.length > 0 ? (

                cursosFiltrados.map((curso) => (

                  <tr key={curso.id}>

                    <td>{curso.id}</td>

                    <td>{curso.nombre}</td>

                    <td>{curso.categoria}</td>

                    <td>{curso.instructor}</td>

                    <td>{curso.nivel}</td>

                    <td>{curso.estudiantes}</td>

                    <td>{curso.promedio.toFixed(2)}</td>

                    <td>
                      <span
                        className={
                          curso.estado === "Excelente"
                            ? "estado-destacado"
                            : curso.estado === "Activo"
                            ? "estado-activo"
                            : "estado-seguimiento"
                        }
                      >
                        {curso.estado}
                      </span>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "20px"
                    }}
                  >
                    No se encontraron cursos con los filtros seleccionados.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

      <div className="resumen-reporte">

        <p>
          <strong>Cursos encontrados:</strong> {cursosFiltrados.length}
        </p>

        <p>
          <strong>Total estudiantes:</strong> {totalEstudiantes}
        </p>

        <p>
          <strong>Promedio general:</strong> {promedioGeneral.toFixed(2)}
        </p>

      </div>

    </div>

  );

};

export default ReporteC1Curso;