import React, { useEffect, useState } from 'react';
import { notaService } from '../../services/notaService';

function ReporteC3Estudiante() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPrograma, setFiltroPrograma] = useState('Todos');
  const [filtroSemestre, setFiltroSemestre] = useState('Todos');
  const [ordenPromedio, setOrdenPromedio] = useState('Ninguno');
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarNotas = async () => {
      setCargando(true);
      setError('');
      try {
        const data = await notaService.listarTodas();
        const estudiantesTransformados = (data || []).map((nota, index) => {
          const promedio = Number(nota.nota ?? nota.promedio ?? 0);
          const asistenciaNum = Number(nota.asistencia ?? 0);
          const asistencia = Number.isFinite(asistenciaNum) && asistenciaNum > 0
            ? `${asistenciaNum}%`
            : 'N/D';

          return {
            id: nota.id ?? index + 1,
            nombre: nota.nombreEstudiante || nota.estudiante || 'Sin nombre',
            documento: String(nota.codigoEstudiante || nota.documento || 'N/D'),
            correo: nota.emailEstudiante || nota.correo || '',
            programa: nota.programa || nota.nombreMateria || 'Sin programa',
            semestre: Number(nota.semestre) || 0,
            asistencia,
            estado: nota.estado || (promedio >= 3 ? 'Aprobado' : 'Reprobado'),
            promedio
          };
        });

        setEstudiantes(estudiantesTransformados);
      } catch {
        setError('No se pudieron cargar los estudiantes desde notas. Verifica la conexión con el backend.');
      } finally {
        setCargando(false);
      }
    };

    cargarNotas();
  }, []);

  const programasDisponibles = [...new Set(estudiantes.map((e) => e.programa).filter(Boolean))];
  const semestresDisponibles = [...new Set(estudiantes.map((e) => e.semestre).filter((s) => s > 0))].sort((a, b) => a - b);

  const getEstadoStyle = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return {
          background: '#e6f7ee',
          color: '#1e8e3e'
        };

      case 'Reprobado':
        return {
          background: '#fde8e8',
          color: '#c53030'
        };

      default:
        return {
          background: '#eee',
          color: '#333'
        };
    }
  };

  const estudiantesFiltrados = estudiantes
    .filter((e) => {
      const coincideBusqueda =
        e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.documento.includes(busqueda) ||
        e.programa.toLowerCase().includes(busqueda.toLowerCase());

      const coincideEstado =
        filtroEstado === 'Todos' || e.estado === filtroEstado;

      const coincidePrograma =
        filtroPrograma === 'Todos' ||
        e.programa === filtroPrograma;

      const coincideSemestre =
        filtroSemestre === 'Todos' ||
        e.semestre === Number(filtroSemestre);

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincidePrograma &&
        coincideSemestre
      );
    })
    .sort((a, b) => {
      if (ordenPromedio === 'Mayor') {
        return b.promedio - a.promedio;
      }

      if (ordenPromedio === 'Menor') {
        return a.promedio - b.promedio;
      }

      return 0;
    });

  return (
    <div
      style={{
        background: 'transparent',
        minHeight: '100vh',
        paddingBottom: '30px'
      }}
    >
      <div style={{ padding: '20px' }}>
        <h2
          style={{
            margin: 0,
            color: '#2d2d2d'
          }}
>          Reporte de Estudiantes
        </h2>

        <p
          style={{
            color: '#666',
            marginTop: '5px'
          }}
        >
          Seguimiento académico individual
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          padding: '0 20px 20px 20px'
        }}
      >
        <input
          type="text"
          placeholder="Buscar por nombre, documento o programa"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid rgba(231, 29, 115, 0.15)',            minWidth: '280px'
          }}
        />

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid rgba(231, 29, 115, 0.15)'
          }}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Reprobado">Reprobado</option>
        </select>

        <select
          value={filtroPrograma}
          onChange={(e) => setFiltroPrograma(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid rgba(231, 29, 115, 0.15)'
          }}
        >
          <option value="Todos">Todos los programas</option>
          {programasDisponibles.map((programa) => (
            <option key={programa} value={programa}>
              {programa}
            </option>
          ))}
        </select>

        <select
          value={filtroSemestre}
          onChange={(e) => setFiltroSemestre(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid rgba(231, 29, 115, 0.15)'
          }}
        >
          <option value="Todos">Todos los semestres</option>
          {semestresDisponibles.map((semestre) => (
            <option key={semestre} value={semestre}>
              {semestre}
            </option>
          ))}
        </select>

        <select
          value={ordenPromedio}
          onChange={(e) => setOrdenPromedio(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid rgba(231, 29, 115, 0.15)'
          }}
        >
          <option value="Ninguno">Ordenar promedio</option>
          <option value="Mayor">Mayor a menor</option>
          <option value="Menor">Menor a mayor</option>
        </select>
      </div>

      <div
        style={{
          padding: '0 20px'
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            overflowX: 'auto',
            boxShadow: 'var(--shadow)',
            border: '1px solid rgba(231,29,115,0.08)',  
          }}
        >
          {cargando && <p style={{ padding: '12px' }}>Cargando estudiantes...</p>}
          {error && <p style={{ padding: '12px', color: '#c53030' }}>{error}</p>}

          {!cargando && !error && (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}
          >
            <thead>
              <tr
              style={{
                background: '#E71D73',
                color: 'white'
              }}
            >
                <th    
                  style={{padding: '12px',  
                  color: 'white'}}> ID</th>
                <th    
                  style={{padding: '12px',  
                  color: 'white'}}>Nombre</th>
                <th    
                  style={{padding: '12px',  
                  color: 'white'}}>Documento</th>
                <th    
                  style={{padding: '12px',  
                  color: 'white'}}>Programa</th>
                <th    
                  style={{padding: '12px',  
                  color: 'white'}}>Semestre</th>
                <th    
                  style={{padding: '12px',  
                  color: 'white'}}>Promedio</th>
                <th    
                  style={{padding: '12px',  
                  color: 'white'}}>Asistencia</th>
                <th    
                  style={{padding: '12px',  
                  color: 'white'}}>Estado</th>
              </tr>
            </thead>

            <tbody>
              {estudiantesFiltrados.map((e) => (
                <tr
                  key={e.id}
                  style={{
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <td style={{ padding: '12px' }}>{e.id}</td>
                  <td style={{ padding: '12px' }}>{e.nombre}</td>
                  <td style={{ padding: '12px' }}>{e.documento}</td>
                  <td style={{ padding: '12px' }}>{e.programa}</td>
                  <td style={{ padding: '12px' }}>{e.semestre}</td>
                  <td style={{ padding: '12px' }}>{e.promedio}</td>
                  <td style={{ padding: '12px' }}>{e.asistencia}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        ...getEstadoStyle(e.estado)
                      }}
                    >
                      {e.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        <p
          style={{
            marginTop: '15px',
            color: '#2d2d2d'
          }}
        >
          Total estudiantes encontrados: {estudiantesFiltrados.length}
        </p>
      </div>
    </div>
  );
}

export default ReporteC3Estudiante;