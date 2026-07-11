import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Reportes.css';

// ── 1. FUNCIÓN QUE EXTRAE DATOS DEL HTML (Ahora vive escondida aquí) ──────────
function obtenerDatosExportacionDesdeDOM(container, combinacion) {
    if (!container) return null;

    const titulo = container.querySelector('h2, h3')?.textContent?.trim() || `Reporte ${combinacion}`;
    const tabla = container.querySelector('table');

    if (!tabla) {
        return {
            reporteId: combinacion,
            titulo,
            table: { headers: [], rows: [] },
        };
    }

    const headers = Array.from(tabla.querySelectorAll('thead th')).map((th) =>
        th.textContent.replace(/[▲▼]/g, '').replace(/\s+/g, ' ').trim()
    );

    const rows = Array.from(tabla.querySelectorAll('tbody tr')).map((fila) =>
        Array.from(fila.querySelectorAll('td')).map((celda) =>
            celda.textContent.replace(/\s+/g, ' ').trim()
        )
    );

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
}

// ── 2. COMPONENTE DE BOTONES (Recibe la referencia del contenedor del padre) ──
function ReportesExportActions({ contenedorRef, combinacion }) {
    // Aquí manejamos internamente los datos leídos para no ensuciar al padre
    const [reporteData, setReporteData] = useState(null);

    // El vigilante (Observer) ahora trabaja de forma privada dentro de los botones
    useEffect(() => {
        const contenedor = contenedorRef?.current;
        if (!contenedor) return;

        const sincronizarExportacion = () => {
            setReporteData(obtenerDatosExportacionDesdeDOM(contenedor, combinacion));
        };

        sincronizarExportacion();

        const observer = new MutationObserver(() => {
            sincronizarExportacion();
        });

        observer.observe(contenedor, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        return () => observer.disconnect();
    }, [contenedorRef, combinacion]);

    // ── Lógica original de validación y exportación ───────────────────────────
    const hasData = Boolean(
        reporteData && (
            reporteData.table?.rows?.length ||
            reporteData.rows?.length
        )
    );

    const handleExportPDF = () => {
        if (!hasData) return;
        exportReportToPDF(reporteData);
    };

    const handleExportExcel = () => {
        if (!hasData) return;
        exportReportToExcel(reporteData);
    };

    return (
        <div className="reporte-export-actions">
            <button className="btn-export btn-export-pdf" onClick={handleExportPDF} disabled={!hasData}>
                Exportar PDF
            </button>
            <button className="btn-export btn-export-excel" onClick={handleExportExcel} disabled={!hasData}>
                Exportar Excel
            </button>
        </div>
    );
}

// ── 3. FUNCIONES DE EXPORTACIÓN (jsPDF y Excel intactas) ─────────────────────
function getReportTable(reporte) {
    if (Array.isArray(reporte?.table?.rows) && reporte.table.rows.length) {
        return {
            headers: reporte.table.headers || [],
            rows: reporte.table.rows,
        };
    }

    if (Array.isArray(reporte?.rows) && reporte.rows.length) {
        return {
            headers: Array.isArray(reporte.headers) && reporte.headers.length ? reporte.headers : [],
            rows: reporte.rows,
        };
    }

    return { headers: [], rows: [] };
}

function exportReportToPDF(reporte) {
    const doc = new jsPDF({ orientation: 'landscape' });
    const margin = 16;
    let y = 18;

    doc.setFontSize(18);
    doc.text(reporte.titulo || 'Reporte', margin, y);

    doc.setFontSize(11);
    y += 8;
    if (reporte.kpiPromedio !== undefined || reporte.kpiTotal !== undefined) {
        doc.text(`Promedio: ${reporte.kpiPromedio ?? '—'}`, margin, y);
        doc.text(`Total: ${reporte.kpiTotal ?? '—'}`, margin + 110, y);
        y += 10;
    }

    const { headers, rows } = getReportTable(reporte);
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
        doc.text('No hay datos visibles para exportar.', margin, y);
    }

    doc.save(`${reporte.reporteId || 'reporte'}-visible.pdf`);
}

function exportReportToExcel(reporte) {
    const { headers, rows } = getReportTable(reporte);
    const lines = [];

    lines.push(['Reporte:', reporte.titulo || '']);
    if (reporte.kpiPromedio !== undefined) lines.push(['Promedio', reporte.kpiPromedio]);
    if (reporte.kpiTotal !== undefined) lines.push(['Total', reporte.kpiTotal]);
    lines.push([]);

    if (headers.length) lines.push(headers);
    rows.forEach((row) => lines.push(row));

    const csvContent = lines.map((line) => line.map((value) => `"${value ?? ''}"`).join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reporte.reporteId || 'reporte'}-visible.xls`;
    link.click();
    URL.revokeObjectURL(url);
}

export default ReportesExportActions;