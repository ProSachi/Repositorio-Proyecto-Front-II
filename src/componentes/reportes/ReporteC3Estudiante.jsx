import React, { useState } from 'react';

function ReporteC3Estudiante() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

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
      estado: 'Excelente',
      promedio: 4.90
    }
  ];

  const getEstadoStyle = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return { background: '#e6f7ee', color: '#1e8e3e' };
      case 'Excelente':
        return { background: '#fff4d6', color: '#b7791f' };
      case 'Reprobado':
        return { background: '#fde8e8', color: '#c53030' };
      default:
        return { background: '#eee', color: '#333' };
    }
  };

  const estudiantesFiltrados = estudiantes.filter((e) => {
    const coincideBusqueda =
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.documento.includes(busqueda);

    const coincideEstado =
      filtroEstado === 'Todos' || e.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '18px',
    padding: '20px',
    justifyContent: 'center'
  };

  const cardStyle = {
    width: '280px',
    borderRadius: '14px',
    padding: '16px',
    background: '#fff',
    border: '1px solid #e6e6e6',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    transition: '0.2s ease',
    cursor: 'pointer'
  };

  return (
    <div style={{ background: '#f5f6f8', minHeight: '100vh' }}>

      <div style={{ padding: '20px 20px 10px 20px' }}>
        <h2 style={{ margin: 0, fontSize: '22px' }}>
          Reporte de Estudiantes
        </h2>

        <p style={{
          marginTop: '6px',
          marginBottom: 0,
          color: '#666',
          fontSize: '14px'
        }}>
          Seguimiento académico individual
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        padding: '0 20px',
        flexWrap: 'wrap'
      }}>
        <input
          placeholder="Buscar por nombre o documento"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '250px'
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
          <option value="Todos">Todos</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Reprobado">Reprobado</option>
          <option value="Excelente">Excelente</option>
        </select>
      </div>

      <div style={containerStyle}>
        {estudiantesFiltrados.map((e) => (
          <div
            key={e.id}
            style={cardStyle}
            onMouseOver={(ev) =>
              (ev.currentTarget.style.transform = 'translateY(-5px)')
            }
            onMouseOut={(ev) =>
              (ev.currentTarget.style.transform = 'translateY(0px)')
            }
          >
            <h3 style={{ marginBottom: '4px' }}>{e.nombre}</h3>
            <small>ID: {e.id}</small>

            <hr />

            <p><strong>Documento:</strong> {e.documento}</p>
            <p><strong>Programa:</strong> {e.programa}</p>
            <p><strong>Semestre:</strong> {e.semestre}</p>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px'
            }}>
              <div>
                <strong>{e.promedio}</strong>
                <br />
                <small>Promedio</small>
              </div>

              <div>
                <strong>{e.asistencia}</strong>
                <br />
                <small>Asistencia</small>
              </div>
            </div>

            <hr />

            <span
              style={{
                padding: '6px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                ...getEstadoStyle(e.estado)
              }}
            >
              Estado: {e.estado}
            </span>

          </div>
        ))}
      </div>

    </div>
  );
}

export default ReporteC3Estudiante;