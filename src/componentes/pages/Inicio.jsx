// ====================================
// PÁGINA DE INICIO (LANDING PAGE)
// Refleja todos los módulos del sistema
// ====================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
/* import logoSura from '../../imagenes/logoSura.png'; */
import './Inicio.css';

function Inicio() {
  const navigate = useNavigate();

  const caracteristicas = [
    {
      icono: '👥',
      titulo: 'Gestión de Usuarios',
      descripcion: 'Registro y administración de profesores y estudiantes con control de roles.',
    },
    {
      icono: '📧',
      titulo: 'Notificaciones',
      descripcion: 'Sistema de mensajería interno con prioridades y seguimiento.',
    },
    {
      icono: '🎓',
      titulo: 'Profesores',
      descripcion: 'Gestión de información docente y asignación de cursos.',
    },
    {
      icono: '📝',
      titulo: 'Notas',
      descripcion: 'Registro y consulta de calificaciones por período académico.',
    },
    {
      icono: '👤',
      titulo: 'Asistencias',
      descripcion: 'Gestión de asistentes por cursos.',
    },
    {
      icono: '🏫',
      titulo: 'Matrícula',
      descripcion: 'Administración de matrículas y cursos del período vigente.',
    },
    {
      icono: '📊',
      titulo: 'Reportes Estadísticos',
      descripcion: 'Visualización de estadísticas y reportes para toma de decisiones.',
    },
  ];

  return (
    <div className="inicio-container">
      <div className="inicio-content">

              {/* Título */}
        <h1 className="inicio-titulo">
        Sistema Académico CESDE
        </h1>

        <p className="inicio-subtitulo">
          Gestión Académica Integral
        </p>

        <p className="inicio-descripcion">
          Plataforma unificada para la administración de usuarios, notificaciones,
          profesores, notas, matrículas y reportes estadísticos.
        </p>

        {/* Botones */}
        <div className="inicio-botones">
          <button
  className="btn-inicio btn-primario btn-primary"
  onClick={() => navigate('/login')}
>
            🔐 Iniciar Sesión
          </button>

          <button
  className="btn-inicio btn-secundario btn-secondary"
  onClick={() => navigate('/registro')}
>
  📝 Registrarse
</button>

        </div>

        {/* Características - todos los módulos */}
        <div className="inicio-caracteristicas">
          {caracteristicas.map((c, i) => (
            <div className="caracteristica" key={i}>
              <div className="caracteristica-icono">{c.icono}</div>
              <h3>{c.titulo}</h3>
              <p>{c.descripcion}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Footer */}
      <footer className="inicio-footer">
        <p>Proyecto Integrador - Sura G8 | 2026</p>
      </footer>
    </div>
  );
}

export default Inicio;
