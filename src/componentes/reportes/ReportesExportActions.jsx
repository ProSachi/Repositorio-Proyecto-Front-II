import { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Reportes.css';

// ── 1. CUSTOM HOOK: Lógica de lectura y monitoreo del DOM (Aislada y optimizada) ──
function useReportScraper(contenedorRef, combinacion) {
  const [reporteData, setReporteData] = useState(null);

  const extraerDatos = useCallback(() => {
    const container = contenedorRef?.current;
    if (!container) return null;

    const tabla = container.querySelector('table');
    const titulo = container.querySelector('h2, h3')?.textContent?.trim() || `Reporte ${combinacion}`;

    if (!tabla) {
      return { reporteId: combinacion, titulo, table: { headers: [], rows: [] } };
    }

    // Limpieza optimizada de encabezados y filas
    const headers = Array.from(tabla.querySelectorAll('thead th')).map((th) =>
      th.textContent.replace(/[▲▼]/g, '').replace(/\s+/g, ' ').trim()
    );

    const rows = Array.from(tabla.querySelectorAll('tbody tr')).map((tr) =>
      Array.from(tr.querySelectorAll('td')).map((td) =>
        td.textContent.replace(/\s+/g, ' ').trim()
      )
    );

    // Búsqueda rápida de KPIs en el texto
    const textoVisible = container.textContent || '';
    const promedioMatch = textoVisible.match(/promedio general(?: de profesores)?:\s*([0-9.,-]+)/i);
    const totalMatch = textoVisible.match(/total estudiantes encontrados:\s*(\d+)/i);

    return {
      reporteId: combinacion,
      titulo,
      table: { headers, rows },
      kpiPromedio: promedioMatch ? Number(promedioMatch[1].replace(',', '.')) : undefined,
      kpiTotal: totalMatch ? Number(totalMatch[1]) : undefined,
    };
  }, [contenedorRef, combinacion]);

  useEffect(() => {
    const contenedor = contenedorRef?.current;
    if (!contenedor) return;

    // Ejecución inicial
    setReporteData(extraerDatos());

    // DEBOUNCE: Evitamos que el Observer congele la app si el DOM cambia muy rápido
    let timeoutId;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setReporteData(extraerDatos());
      }, 250); // Espera 250ms a que el DOM se "calme" antes de leer
    });

    observer.observe(contenedor, { childList: true, subtree: true, characterData: true });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [contenedorRef, extraerDatos]);

  return reporteData;
}

// ── 2. COMPONENTE PRINCIPAL (Visualmente limpio) ─────────────────────────────
function ReportesExportActions({ contenedorRef, combinacion }) {
  const reporteData = useReportScraper(contenedorRef, combinacion);

  const hasData = Boolean(reporteData?.table?.rows?.length);

  return (
    <div className="reporte-export-actions">
      <button
        className="btn-export btn-export-pdf"
        onClick={() => hasData && exportToPDF(reporteData)}
        disabled={!hasData}
      >
        Exportar PDF
      </button>
      <button
        className="btn-export btn-export-excel"
        onClick={() => hasData && exportToExcel(reporteData)}
        disabled={!hasData}
      >
        Exportar Excel
      </button>
    </div>
  );
}

// ── 3. FUNCIONES DE EXPORTACIÓN (Utilitarios puros) ──────────────────────────
function exportToPDF(reporte) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const margin = 16;
  let y = 18;

  doc.setFontSize(18);
  doc.text(reporte.titulo || 'Reporte', margin, y);

  if (reporte.kpiPromedio !== undefined || reporte.kpiTotal !== undefined) {
    doc.setFontSize(11);
    y += 8;
    doc.text(`Promedio: ${reporte.kpiPromedio ?? '—'}`, margin, y);
    doc.text(`Total: ${reporte.kpiTotal ?? '—'}`, margin + 110, y);
    y += 10;
  }

  const { headers, rows } = reporte.table || { headers: [], rows: [] };

  if (headers.length || rows.length) {
    autoTable(doc, {
      startY: y,
      head: headers.length ? [headers] : undefined,
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 85, 164], textColor: 255 },
      theme: 'striped',
      margin: { left: margin, right: margin },
    });
  } else {
    doc.setFontSize(11);
    doc.text('No hay datos visibles para exportar.', margin, y);
  }

  doc.save(`${reporte.reporteId || 'reporte'}-export.pdf`);
}

function exportToExcel(reporte) {
  const { headers, rows } = reporte.table || { headers: [], rows: [] };
  const lines = [];

  lines.push(['Reporte:', reporte.titulo || '']);
  if (reporte.kpiPromedio !== undefined) lines.push(['Promedio', reporte.kpiPromedio]);
  if (reporte.kpiTotal !== undefined) lines.push(['Total', reporte.kpiTotal]);
  lines.push([]); // Línea vacía separadora

  if (headers.length) lines.push(headers);
  rows.forEach((row) => lines.push(row));

  // Escapamos comillas y unimos por comas
  const csvContent = lines
    .map((line) => line.map((val) => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  // \uFEFF es el BOM de UTF-8: Le dice a Excel que el archivo tiene tildes y caracteres latinos
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  // Lo guardamos como .csv que es su formato real, abriéndose perfecto en Excel sin alertas
  link.download = `${reporte.reporteId || 'reporte'}-export.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default ReportesExportActions;