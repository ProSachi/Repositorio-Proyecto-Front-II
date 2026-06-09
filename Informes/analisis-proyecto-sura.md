# 📊 Análisis Proyecto SuraG8 — Spring Boot + React

> **Base API:** `http://localhost:8080/apisura8/v1/`  
> **Backend:** Spring Boot + JPA (H2 archivo local) · **Frontend:** React 18 (CRA)

---

## 🏗️ Resumen General

Es un sistema académico con 8 módulos: **Usuarios, Profesores, Cursos, Matrícula, Asistencias, Notas, Notificaciones y Reportes**.

- **Backend:** Spring Boot + H2 (archivo local), con Swagger/OpenAPI configurado. Puerto 8080.
- **Frontend:** React 18 (CRA), con Axios, SweetAlert2, exportación PDF/CSV.

---

## 📋 Estado del Backend — Endpoints por módulo

| Módulo         | GET all | GET /{id} | POST | PUT | DELETE |
|----------------|:-------:|:---------:|:----:|:---:|:------:|
| Asistencias    | ✅      | ✅        | ✅   | ❌  | ❌     |
| Cursos         | ✅      | ✅        | ✅   | ❌  | ❌     |
| Matrícula      | ✅      | ✅        | ✅   | ❌  | ❌     |
| **Notas**      | ✅      | ✅        | ✅   | ✅  | ✅     |
| Notificaciones | ✅      | ✅        | ✅   | ❌  | ❌     |
| Profesores     | ✅      | ✅        | ✅   | ❌  | ❌     |
| Reportes       | ✅      | ✅        | ✅   | ❌  | ❌     |
| Usuarios       | ✅      | ✅        | ✅   | ❌  | ❌     |

> ⚠️ **Solo el módulo de Notas tiene CRUD completo.** Los demás actualizan haciendo `POST` con el `id` en el body (JPA upsert). 
No hay `PUT /{id}` ni `DELETE /{id}` en el resto.

---

## 🗂️ Detalle por módulo

### 1. 🏃 Asistencias

**Entidad:** `id`, `nombrePersona`, `fecha` (LocalDate), `horaEntrada` (LocalTime), `asistio` (Boolean)

**Endpoints:**
- `POST /asistencias` — Registrar asistencia
- `GET /asistencias` — Listar todas
- `GET /asistencias/{id}` — Buscar por ID

**Frontend implementado:**
- `ListaAsistencias.jsx` — lista + formulario de registro integrado, KPIs, exportar CSV/PDF
- `asistenciaService.js` — crear, listarTodas, buscarPorId, filtrarPorNombre (cliente)

**❌ Faltante:**
- No `PUT` ni `DELETE` — una asistencia registrada no se puede corregir ni eliminar
- No búsqueda por nombre en el backend — el filtro trae todo y filtra en cliente
- No hay campo `curso` o `materia` en la entidad

---

### 2. 📖 Cursos

**Entidad:** `id`, `titulo`, `duracion`, `maestro`, `estudiantes`, `tipoCurso`, `fechaCreacion`, `calificacion`, `fechaFinalizacion`, `capitulosCurso`, `presencialidad` (Boolean), `comentarios`, `intensidad`, `lugarRealizacion`, `descripcion`

**Endpoints:**
- `POST /cursos` — Crear o actualizar (upsert)
- `GET /cursos` — Listar todos
- `GET /cursos/{id}` — Buscar por ID

**Frontend implementado:**
- `ListaCursos.jsx` — grid de tarjetas, modal de detalle, filtro por tipo
- `FormularioCurso.jsx` — formulario dual crear/editar con 4 secciones
- `cursoService.js` — crear, listarTodos, buscarPorId, actualizar, desactivar

**❌ Faltante:**
- No `PUT /{id}` ni `DELETE /{id}` reales
- `desactivar()` usa el campo `presencialidad` (presencial/virtual) como flag de activo/inactivo — **semántica incorrecta**. Falta campo `activo: Boolean`
- No confirmación al desactivar un curso

---

### 3. 🏫 Matrícula

**Entidad:** `id`, `nombre`, `documento`, `correo`, `fechaMatricula` (LocalDate), `valorMatricula` (Double)

**Endpoints:**
- `POST /matriculas` — Crear o actualizar
- `GET /matriculas` — Listar todas
- `GET /matriculas/{id}` — Buscar por ID

**Frontend implementado:**
- `ListaMatricula.jsx` — tabla + KPIs (total, valor recaudado, último registro)
- `FormularioMatricula.jsx` — formulario dual con validación completa y resumen post-envío
- `matriculaService.js` — listarTodas, buscarPorId, guardar

**❌ Faltante:**
- No botón de eliminar matrícula
- No `PUT /{id}` ni `DELETE /{id}` en backend
- No cancelación de matrícula — solo edición del registro completo

---

### 4. 📝 Notas *(módulo más completo)*

**Entidad:** `id`, `nombreEstudiante`, `codigoEstudiante`, `emailEstudiante`, `estadoMatricula`, `nombreMateria`, `tipoExamen`, `edadEstudiante`, `añoInicio`, `numeroMaterias`, `numeroAsistencias`, `idNota`, `estado`, `repitente`, `promedio`, `nota`, `fechaExamen`

**Endpoints:**
- `POST /notas` — Crear nota
- `GET /notas` — Listar todas o filtrar por `?email=`
- `GET /notas/{id}` — Buscar por ID
- `PUT /notas/{id}` — Actualizar nota ✅
- `DELETE /notas/{id}` — Eliminar nota ✅

**Frontend implementado:**
- `ListaNotas.jsx` — tabla paginada, filtro inteligente, export CSV/PDF
- `CrearNota.jsx` — selects dinámicos de estudiantes y cursos
- `EditarNota.jsx` — formulario pre-cargado
- `notaService.js` — crear, listarTodas, listarPorEmail, actualizar, eliminar

**⚠️ Issues menores:**
- `EditarNota` carga todas las notas y busca por ID en cliente — debería usar `GET /notas/{id}`
- `codigoEstudiante` referencia `estudiante?.codigo` que no existe en la entidad `Usuario`
- La entidad tiene 15+ campos pero el formulario solo usa 6

---

### 5. 🔔 Notificaciones

**Entidad:** `id`, `idRemitente`, `idDestinatario`, `emailRemitente`, `emailDestinatario`, `asunto`, `cuerpoMensaje`, `tipoNotificacion`, `prioridad`, `cursoRelacionado`, `categoriaCurso`, `fechaEntrega`, `fechaCreacion`, `fechaEnvio`, `horaEnvio`, `mensajeEnviado`, `mensajeLeido`, `mensajeEliminado`, `estado`, `cantidadArchivosAdjuntos`, `notificacionEmergente`

**Endpoints:**
- `POST /notificaciones` — Crear o actualizar
- `GET /notificaciones` — Listar todas
- `GET /notificaciones/{id}` — Buscar por ID

**Frontend implementado:**
- `FormularioNotificacion.jsx` — 6 secciones, todos los 20 campos
- `ListaNotificaciones.jsx` — tabla con modal de detalles, edición inline
- `EditarNotificacion.jsx` — formulario completo pre-cargado
- `notificationService.js` — crear, listarTodas, buscarPorId, actualizar

**❌ Faltante:**
- No `PUT /{id}` ni `DELETE /{id}` en backend
- No botón de eliminar
- Doble sistema de edición conflictivo: ruta `/notificaciones/editar/:id` Y edición inline simultánea
- Las fechas son `String` en la entidad — inconsistente con otros módulos que usan `LocalDate`
- `idRemitente` e `idDestinatario` son IDs manuales sin FK a la tabla de usuarios

---

### 6. 👨‍🏫 Profesores

**Entidad:** `id`, `nombreCompleto`, `edad`, `tipoIdentificacion`, `numeroDocumento`, `correoElectronico`, `direccion`, `celular`, `estadoCivil`, `genero`, `perfilProfesional`, `hojaDeVida`, `foto`, `idiomasDominados`, `estudiosObtenidos`, `nivelAcademico`, `escalafon`, `anosExperiencia`, `areasAsignadas`, `vigencia` (Boolean), `tipoContrato`, `jornadaLaboral`, `horasSemanales`, `fechaIngreso`

**Endpoints:**
- `POST /profesores` — Crear o actualizar
- `GET /profesores` — Listar todos
- `GET /profesores/{id}` — Buscar por ID

**Frontend implementado:**
- `ListaProfesores.jsx` — grid de tarjetas con foto, modal de detalle diferenciado por rol
- `FormularioProfesor.jsx` — formulario dual con 4 secciones
- `profesorService.js` — listarTodos, buscarPorId, crear, actualizar, desactivar

**❌ Faltante:**
- No `PUT /{id}` ni `DELETE /{id}` en backend
- Campos omitidos en el formulario: `direccion`, `idiomasDominados`, `estudiosObtenidos`, `escalafon`, `horasSemanales`, `fechaIngreso`
- `ListaProfesores` usa `window.confirm()` para desactivar — inconsistente con SweetAlert2 del resto del proyecto

---

### 7. 📊 Reportes

**Entidad:** `id`, `notaFinal`, `desempeno`, `asistenciaTotal`, `promedioCursos`, `promedioNotaCursos`, `cantidadCursos`, `asistenciaCursos`, `cursoPopular`, `cursoMenosPopular`, `cantidadHorasCurso`, `cantidadUsuarios`, `cantidadUsuariosCurso`, `promedioUsuariosAprobadosCurso`, `promedioMatricula`, `calificacionDocente`, `tipoReporte` (ACADEMICO|ADMINISTRATIVO), `periodoReporte`

**Endpoints:**
- `POST /reportes` — Crear o actualizar
- `GET /reportes` — Listar todos
- `GET /reportes/{id}` — Buscar por ID

**Frontend implementado:**
- `ReportesEstadisticos.jsx` — tabs académico/administrativo, KPI cards, modal detalle, formulario inline
- `reporteService.js` — listarTodos, buscarPorId, crear, actualizar, listarAcademicos, listarAdministrativos

**❌ Faltante:**
- No `PUT /{id}` ni `DELETE /{id}` en backend
- `tipoReporte` no es un Enum en el backend — solo String sin validación
- Filtro por tipo se hace en cliente — no hay endpoint `/reportes?tipo=ACADEMICO`
- Los reportes se crean **manualmente** — no se calculan desde los datos reales del sistema

---

### 8. 👤 Usuarios

**Entidad:** `id`, `nombre`, `correo`, `contraseña`, `rol`, `telefono`

**Endpoints:**
- `POST /usuarios` — Crear usuario
- `GET /usuarios` — Listar todos
- `GET /usuarios/{id}` — Buscar por ID

**Frontend implementado:**
- `LoginUsuarios.jsx` — formulario de login
- `UsuarioFormulario.jsx` — registro de nuevo usuario
- `ListaUsuarios.jsx` — grid de tarjetas (solo Profesor)
- `usuarioService.js` — crear, listarTodos, buscarPorId, actualizar, login

**❌ Faltante:**
- No pantalla de "editar perfil" para el usuario logueado
- `ListaUsuarios.jsx` tiene `useEffect` duplicado — doble llamada al backend al cargar

---

## 🔑 Problemas críticos a corregir

### 🔴 CRÍTICO — Seguridad

| # | Problema | Descripción |
|---|----------|-------------|
| 1 | **Login inseguro** | `usuarioService.login()` descarga **TODOS los usuarios con sus contraseñas** y valida en el navegador. Cualquiera con DevTools puede verlas. |
| 2 | **Contraseñas en texto plano** | Se almacenan sin hash (BCrypt) en la base de datos. |
| 3 | **No existe `POST /auth/login`** | No hay autenticación real del lado servidor. |
| 4 | **Sin protección de endpoints** | Ningún endpoint requiere autenticación — cualquiera puede consumir la API. |

### 🟠 ALTO — Arquitectura

| # | Problema | Descripción |
|---|----------|-------------|
| 5 | **7 de 8 módulos sin PUT/DELETE** | Solo Notas está completo. Falta `@PutMapping("/{id}")` y `@DeleteMapping("/{id}")` en los otros 7 controladores. |
| 6 | **`desactivar` curso usa campo incorrecto** | `cursoService.desactivar()` pone `presencialidad=false` cuando ese campo significa presencial/virtual. Falta campo `activo: Boolean` en `Curso`. |

### 🟡 MEDIO — Calidad de código

| # | Problema | Descripción |
|---|----------|-------------|
| 7 | **`useEffect` duplicado** | `ListaUsuarios.jsx` tiene dos `useEffect` idénticos → doble llamada al backend. |
| 8 | **`EditarNota` ineficiente** | Carga TODAS las notas para encontrar una por ID — usar `GET /notas/{id}` directamente. |
| 9 | **Campo `codigo` inexistente** | `CrearNota` referencia `estudiante?.codigo` pero `Usuario.java` no tiene ese campo. |
| 10 | **Typo en backend** | `ControladorBusarPotId` en `ControladorUsuario` — debería ser `ControladorBuscarPorId`. |
| 11 | **`contraseña` con tilde** | El nombre del campo en `Usuario.java` puede causar problemas de encoding al migrar a MySQL/PostgreSQL. |

### 🟢 BAJO — UX / Completitud

| # | Problema | Descripción |
|---|----------|-------------|
| 12 | **`window.confirm()` en Profesores** | Usar SweetAlert2 como el resto del proyecto. |
| 13 | **Doble editor de Notificaciones** | Ruta `/notificaciones/editar/:id` Y edición inline coexisten — elegir uno. |
| 14 | **Campos de Nota no usados** | La entidad tiene 15+ campos pero el formulario solo usa 6. Documentar o eliminar. |
| 15 | **Fechas como String en Notificación** | Cambiar a `LocalDate`/`LocalDateTime` para consistencia con otros módulos. |
| 16 | **Reportes manuales** | Idealmente se calcularían automáticamente desde notas, asistencias y matrículas. |

---

## 💡 Evaluación General

| Aspecto | Estado |
|---------|--------|
| Estructura de capas (Controller → Service → Repository → Model) | ✅ Correcta y consistente |
| Diferenciación de roles en el frontend (Profesor vs Estudiante) | ✅ Bien implementada |
| Módulo más completo | ✅ **Notas** (CRUD completo en ambos lados) |
| Exportación CSV/PDF | ✅ Funcionando |
| Swagger / OpenAPI | ✅ Configurado |
| CORS | ✅ Bien manejado |
| Seguridad | 🔴 Crítica — login simulado en cliente |
| CRUD completo en backend | 🟠 Solo 1 de 8 módulos (Notas) |
| Progreso estimado | **~70-75%** |

---

*Generado el 02/06/2026 — GitHub Copilot CLI*
