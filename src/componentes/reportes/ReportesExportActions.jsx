import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Reportes.css';

function ReportesExportActions({ reporteData }) {
    const hasData = Boolean(
        reporteData && (
            reporteData.table?.rows?.length ||
            (Array.isArray(reporteData.labels) && reporteData.labels.length) ||
            (Array.isArray(reporteData.values) && reporteData.values.length)
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

function getReportTable(reporte) {
    if (Array.isArray(reporte.table?.rows) && reporte.table.rows.length) {
        return {
            headers: reporte.table.headers || [],
            rows: reporte.table.rows,
        };
    }

    if (Array.isArray(reporte.labels) && reporte.labels.length) {
        const headers = ['Etiqueta', 'Valor'];
        const rows = reporte.labels.map((label, index) => [
            label,
            Array.isArray(reporte.values) ? reporte.values[index] ?? '' : '',
        ]);
        return { headers, rows };
    }

    if (Array.isArray(reporte.values) && reporte.values.length) {
        return {
            headers: ['Valor'],
            rows: reporte.values.map((value) => [value]),
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
