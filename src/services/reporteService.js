// ====================================
// SERVICIO DE REPORTES - UNIFICADO
// Solo accesible para rol Profesor
// ====================================

const API_URL = 'http://localhost:8080/apisura8/v1/reportes';

const MOCK_REPORTES = [
  {
    id: 'C1',
    reporteId: 'C1',
    titulo: 'Notas por curso',
    chartType: 'bar',
    labels: ['Backend', 'Frontend', 'Base de Datos', 'DevOps'],
    values: [4.4, 4.1, 3.7, 4.0],
    kpiPromedio: 4.08,
    kpiTotal: 6,
  },
  {
    id: 'C2',
    reporteId: 'C2',
    titulo: 'Notas por profesor',
    chartType: 'bar',
    labels: ['Ana Fernandez', 'Luis Martinez', 'Carlos Lopez', 'Clara Vega'],
    values: [4.5, 4.1, 3.8, 4.0],
    kpiPromedio: 4.02,
    kpiTotal: 5,
  },
  {
    id: 'C3',
    reporteId: 'C3',
    titulo: 'Notas por estudiante',
    chartType: 'bar',
    labels: ['Mariana Ruiz', 'Sofia Ramirez', 'Juan Perez', 'Laura Gomez'],
    values: [4.9, 4.8, 4.7, 4.7],
    kpiPromedio: 3.96,
    kpiTotal: 120,
  },
];

const normalizeReportesResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const entries = Object.entries(data)
      .filter(([key]) => key !== 'meta')
      .map(([key, value]) => ({ id: key, reporteId: key, ...value }));
    if (entries.length) return entries;
  }
  return [];
};

const findMockReporte = (id) => {
  const searchKey = id?.toString().trim().toUpperCase();
  return MOCK_REPORTES.find((item) =>
    [item.id, item.reporteId, item.codigo, item.tipoReporte, item.nombre, item.titulo]
      .some((value) => value?.toString().trim().toUpperCase() === searchKey)
  );
};

export const reporteService = {

  listarTodos: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        console.warn(`listarTodos() API falló con status ${response.status}. Usando datos mock.`);
        return [...MOCK_REPORTES];
      }

      const data = await response.json();
      const reportes = normalizeReportesResponse(data);
      if (reportes.length > 0) return reportes;

      console.warn('listarTodos() devolvió datos vacíos o inesperados. Usando datos mock.');
      return [...MOCK_REPORTES];
    } catch (error) {
      console.error('Error en listarTodos():', error);
      return [...MOCK_REPORTES];
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) return data;
      }

      const fallback = findMockReporte(id);
      if (fallback) {
        console.warn(`buscarPorId(${id}) falló. Usando reporte mock de respaldo.`);
        return fallback;
      }

      throw new Error(`No se encontró el reporte con ID ${id}`);
    } catch (error) {
      const fallback = findMockReporte(id);
      if (fallback) {
        console.warn(`buscarPorId(${id}) produjo error. Usando reporte mock de respaldo.`);
        return fallback;
      }

      console.error('Error en buscarPorId():', error);
      throw error;
    }
  },

  crear: async (reporte) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reporte),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear el reporte');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en crear():', error);
      throw error;
    }
  },

  actualizar: async (reporte) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reporte),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar el reporte');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en actualizar():', error);
      throw error;
    }
  },

  // Filtra reportes por tipo en el frontend
  listarAcademicos: async () => {
    const todos = await reporteService.listarTodos();
    return todos.filter(r => r.tipoReporte === 'ACADEMICO' || !r.tipoReporte);
  },

  listarAdministrativos: async () => {
    const todos = await reporteService.listarTodos();
    return todos.filter(r => r.tipoReporte === 'ADMINISTRATIVO');
  },
};