# Plan de trabajo paralelo


## 1) Reglas del equipo

- **T1 se define entre todos** (sesión corta de acuerdo).
- Cada tarea de reporte consume solo su bloque mock (`C1`, `C2`, `C3`).
- Se definen contratos claros entre Page, Service y componentes.

---

## 2) Combinaciones (definición clara)

- **C1 (curso):** notas por curso y promedio por curso.
- **C2 (profesor):** notas por profesor y promedio por profesor.
- **C3 (estudiante):** notas por estudiante y promedio por estudiante.

Mapeo de tarea:
- **T2 -> C1**
- **T3 -> C2**
- **T4 -> C3**

---
## 3) Componentes que deben existir (nombres oficiales)

- `ReportesPage.jsx` (contenedor principal).
- `ReporteC1Curso.jsx` (combinación C1).
- `ReporteC2Profesor.jsx` (combinación C2).
- `ReporteC3Estudiante.jsx` (combinación C3).
- `ReportesFilters.jsx` (filtros y botón consultar).
- `ReportesStateHandler.jsx` (loading/empty/error/success).
- `ReportesExportActions.jsx` (PDF/Excel).
- `reporteService.js` (acceso a datos).

---

## 4) Tareas (10)

1. **T1 (todos):** acuerdo de contrato JSON + mocks por tarea.
2. **T2:** implementar `ReporteC1Curso.jsx` con datos `C1`.
3. **T3:** implementar `ReporteC2Profesor.jsx` con datos `C2`.
4. **T4:** implementar `ReporteC3Estudiante.jsx` con datos `C3`.
5. **T5:** preparar `ReportesPage.jsx` con slots para C1, C2 y C3.
6. **T6:** implementar `reporteService.js` (fetch/mock, parse y API pública simple).
7. **T7:** implementar `ReportesExportActions.jsx` (PDF y Excel del reporte visible).
8. **T8:** UI general APP - parte A (tokens visuales y layout base).
9. **T9:** UI general APP - parte B (aplicar estilo en todos los módulos).
10. **T10:** bug hunting responsive (documenta y corrige en toda la app).

---

## 5) Qué deben saber los demás sobre T6 (service)

El estudiante de T6 debe publicar un contrato simple:

- `getReporteData(reporteId, filtros)` -> retorna un diccionario JSON listo para pintar.
- `reporteId` válidos: `"C1"`, `"C2"`, `"C3"`.
- Respuesta estándar:
  - `titulo`
  - `chartType`
  - `labels`
  - `values`
  - `kpiPromedio`
  - `kpiTotal`
- Manejo de error estándar:
  - `{ code, message }`

Impacto en los demás:
- T2, T3, T4, T5 y T7 consumen esta API.
- Si cambia la forma de datos, rompe componentes; por eso el contrato debe congelarse temprano.

---

## 6) Qué debe hacer T7 y cómo afecta a los demás

T7 debe:
1. Exportar a **PDF** lo que está visible (KPIs + gráfica + tabla actual).
2. Exportar a **Excel** la tabla del reporte activo.
3. Recibir datos ya normalizados desde `reporteService`.

Impacto:
- T3/T4/T5 deben exponer datos y tabla con estructura estable.
- T2 debe dejar un punto único para saber cuál reporte está activo.

---

## 7) T8 y T9 (UI general): qué definir y qué comunicar al equipo

### T8 (UI general A) define
- variables de color, tipografía, spacing, radios, sombras
- estilos base de botones, inputs, cards, tablas, modales
- estructura base de layout y navegación

### T9 (UI general B) ejecuta
- aplicar esos estilos en Usuarios, Profesores, Cursos, Matrícula, Asistencias, Notas, Notificaciones y Reportes
- eliminar inconsistencias visuales entre pantallas

### Qué deben decir a los compañeros
1. **Guía rápida de estilos** (qué clases usar y qué no).
2. **Checklist de implementación** por componente.
3. **Ejemplos base** (botón primario, card, tabla, formulario).
4. Regla: no crear estilos nuevos sin revisar T8/T9.

---

## 8) Asignación sugerida

| Estudiante | Principal | Opción | Entregable |
|---|---|---|---|
| E1 | T5 | T7 | `ReportesPage.jsx` con slots de componentes |
| E2 | T2 | T6 | `ReporteC1Curso.jsx` |
| E3 | T3 | T6 | `ReporteC2Profesor.jsx` |
| E4 | T4 | T7 | `ReporteC3Estudiante.jsx` |
| E5 | T6 | T10 | `reporteService.js` con contrato estable |
| E6 | T10 | T7 | Documento de bugs responsive + correcciones |
| E7 | T8 | T9 | Base visual global |
| E8 | T9 | T8 | Homogeneización visual de toda la app |

---

## 9) Definition of Done

- T1 acordado por todo el grupo.
- `ReportesPage` integra C1, C2 y C3 sin conflictos.
- Service (T6) estable y usado por componentes.
- Exportación PDF/Excel operativa.
- Dos estudiantes completan UI general (T8/T9).
- Un estudiante cierra bugs responsive (T10) con evidencia.
