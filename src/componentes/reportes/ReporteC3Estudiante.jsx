import React, { useState } from 'react';

function ReporteC3Estudiante() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPrograma, setFiltroPrograma] = useState('Todos');
  const [filtroSemestre, setFiltroSemestre] = useState('Todos');
  const [ordenPromedio, setOrdenPromedio] = useState('Ninguno');

  const estudiantes = [
    {
      id: 1001,
      nombre: 'Juan Pérez',
      documento: '1034567890',
      correo: 'juan.perez@sura8.edu.co',
      programa: 'Ingeniería de Sistemas',
      semestre: 5,
      asistencia: '92%',
      estado: 'Aprobado',
      promedio: 4.35
    },
    {
      id: 1002,
      nombre: 'María Gómez',
      documento: '1045678901',
      correo: 'maria.gomez@sura8.edu.co',
      programa: 'Ingeniería Industrial',
      semestre: 4,
      asistencia: '95%',
      estado: 'Aprobado',
      promedio: 4.70
    },
    {
      id: 1003,
      nombre: 'Carlos Ramírez',
      documento: '1056789012',
      correo: 'carlos.ramirez@sura8.edu.co',
      programa: 'Administración de Empresas',
      semestre: 6,
      asistencia: '88%',
      estado: 'Reprobado',
      promedio: 2.90
    },
    {
      id: 1004,
      nombre: 'Laura Martínez',
      documento: '1067890123',
      correo: 'laura.martinez@sura8.edu.co',
      programa: 'Contaduría Pública',
      semestre: 3,
      asistencia: '97%',
      estado: 'Aprobado',
      promedio: 4.90
    }
  ];

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
        background: '#f5f6f8',
        minHeight: '100vh',
        paddingBottom: '30px'
      }}
    >
      <div style={{ padding: '20px' }}>
        <h2 style={{ margin: 0 }}>
          Reporte de Estudiantes
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
            border: '1px solid #ccc',
            minWidth: '280px'
          }}
        />

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc'
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
            border: '1px solid #ccc'
          }}
        >
          <option value="Todos">Todos los programas</option>
          <option value="Ingeniería de Sistemas">
            Ingeniería de Sistemas
          </option>
          <option value="Ingeniería Industrial">
            Ingeniería Industrial
          </option>
          <option value="Administración de Empresas">
            Administración de Empresas
          </option>
          <option value="Contaduría Pública">
            Contaduría Pública
          </option>
        </select>

        <select
          value={filtroSemestre}
          onChange={(e) => setFiltroSemestre(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        >
          <option value="Todos">Todos los semestres</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>

        <select
          value={ordenPromedio}
          onChange={(e) => setOrdenPromedio(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc'
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
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}
          >
            <thead>
              <tr
                style={{
                  background: '#f0f2f5'
                }}
              >
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Nombre</th>
                <th style={{ padding: '12px' }}>Documento</th>
                <th style={{ padding: '12px' }}>Programa</th>
                <th style={{ padding: '12px' }}>Semestre</th>
                <th style={{ padding: '12px' }}>Promedio</th>
                <th style={{ padding: '12px' }}>Asistencia</th>
                <th style={{ padding: '12px' }}>Estado</th>
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
        </div>

        <p
          style={{
            marginTop: '15px',
            color: '#666'
          }}
        >
          Total estudiantes encontrados: {estudiantesFiltrados.length}
        </p>
      </div>
    </div>
  );
}

export default ReporteC3Estudiante;