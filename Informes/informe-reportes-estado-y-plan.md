# Informe módulo de Reportes: arquitectura de recepción de datos analizados

Fecha: 2026-06-02

## 1) Nuevo enfoque acordado

El módulo de reportes no calculará métricas en Spring Boot.

La analítica se hará en un proyecto aparte (Python), y el frontend consumirá por API un JSON ya procesado para pintar gráficas.

---

## 2) Estado actual

### Backend (Spring Boot)
- Tiene CRUD de `reportes` (`POST`, `GET`, `GET/{id}`).
- No genera analítica ni agregaciones.
- Puede evolucionar para actuar como:
  - **proxy/orquestador** del microservicio Python, o
  - **gateway** de respuesta hacia el frontend.

### Frontend (React)
- Hoy muestra reportes creados manualmente.
- No tiene una integración orientada a datasets analíticos para gráficas.

---

## 3) Objetivo funcional

En `/reportes`, el usuario selecciona filtros (por ejemplo período/tipo), se llama una API que devuelve JSON analítico, y el frontend transforma ese JSON en estructuras JS para renderizar gráficas y KPIs.

---

## 4) Contrato JSON recomendado (respuesta analítica)

```json
{
  "meta": {
    "fuente": "python-analytics",
    "generadoEn": "2026-06-02T17:30:00Z",
    "periodo": "2026-1",
    "tipoReporte": "ACADEMICO"
  },
  "kpis": {
    "promedioNotas": 4.1,
    "asistenciaPromedio": 0.89,
    "totalEstudiantes": 120
  },
  "series": {
    "notasPorCurso": [
      { "curso": "Backend", "valor": 4.3 },
      { "curso": "Frontend", "valor": 3.9 }
    ],
    "asistenciaMensual": [
      { "mes": "2026-01", "valor": 0.92 },
      { "mes": "2026-02", "valor": 0.87 }
    ]
  },
  "tablas": {
    "topCursos": [
      { "curso": "Backend", "promedio": 4.3, "estudiantes": 38 }
    ]
  }
}
```

---

## 5) Tareas a realizar — Backend

## 5.1 Definir integración con analítica Python
- Decidir patrón:
  - **A. Frontend -> Python directo** (más simple)
  - **B. Frontend -> Spring -> Python** (recomendado para centralizar seguridad y CORS)
- Si se usa B, crear cliente HTTP en Spring para consultar el servicio Python.

## 5.2 Crear endpoint de consumo analítico
- Endpoint sugerido:
  - `GET /apisura8/v1/reportes/analiticos?tipo=ACADEMICO&periodo=2026-1`
- El endpoint retorna JSON ya analizado (sin recalcular en Java).

## 5.3 Validación y robustez
- Validar parámetros requeridos (`tipo`, `periodo`).
- Manejar timeout y errores del servicio Python.
- Responder con estructura consistente de error:
  - código
  - mensaje
  - timestamp.

## 5.4 Seguridad y observabilidad
- Definir autenticación para endpoint analítico.
- Registrar logs de consulta (tipo/período/tiempo de respuesta).
- Opcional: caché por período para evitar llamadas repetidas.

## 5.5 Compatibilidad con lo existente
- Mantener CRUD actual de `reportes` solo si se necesita histórico manual.
- Si ya no aporta valor, planear su deprecación controlada.

---

## 6) Tareas a realizar — Frontend

## 6.1 Servicio de datos analíticos
- Crear/ajustar `reporteService` para consumir:
  - `GET /reportes/analiticos?...`
- Transformar respuesta JSON a estructuras consumibles por librería de gráficas.

## 6.2 Modelo de datos en JS
- Mapear la respuesta a objetos claros:
  - `meta`
  - `kpis`
  - `series`
  - `tablas`
- Evitar lógica de negocio pesada en componentes visuales.

## 6.3 Render de gráficas
- Definir tipos de gráfica por dataset:
  - barras: comparativos por curso
  - líneas: evolución temporal
  - pastel/donut: distribuciones
- Incluir tarjetas KPI y tabla resumen.

## 6.4 Estados de interfaz
- `loading`: mientras llega respuesta.
- `empty`: sin datos para filtros seleccionados.
- `error`: fallo de API o timeout.

## 6.5 Filtros y experiencia de usuario
- Filtros mínimos:
  - tipo de reporte
  - período
- Botón: **Consultar reporte** (ya no “crear reporte”).
- Mensajes claros sobre fuente de datos analizados.

---

## 7) Plan de implementación sugerido

1. Definir contrato JSON final con el equipo de Python.
2. Exponer endpoint analítico en backend (proxy o directo).
3. Integrar `reporteService` en frontend.
4. Renderizar KPIs + gráficas + tabla.
5. Ajustar estados (loading/error/empty) y validaciones.
6. Mantener o deprecar CRUD manual de reportes.

---

## 8) Resultado esperado

- El usuario entra a `/reportes`.
- Selecciona filtros.
- El frontend recibe un JSON analítico.
- Se convierten datos a objetos JS y se renderizan gráficas automáticamente.
- El flujo queda orientado a **consumo de analítica**, no a carga manual de reportes.
