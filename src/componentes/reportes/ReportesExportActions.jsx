import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Reportes.css';

// ========== FUNCIONES AUXILIARES ==========

const limpiar = (texto = '') => texto.replace(/[▲▼]/g, '').replace(/\s+/g, ' ').trim();

const extraerDatos = (container, combinacion) => {
    const tabla = container?.querySelector('table');
    if (!tabla) return null;

    const headers = Array.from(tabla.querySelectorAll('thead th')).map(el => limpiar(el.textContent));
    const rows = Array.from(tabla.querySelectorAll('tbody tr')).map(tr =>
        Array.from(tr.querySelectorAll('td')).map(td => limpiar(td.textContent))
    );

    if (!rows.length) return null;

    const texto = container.textContent || '';

    const promedio = texto.match(/promedio general.*?:\s*([0-9.,-]+)/i)?.[1]?.replace(',', '.');
    const total = texto.match(/total estudiantes.*?:\s*(\d+)/i)?.[1];

    const kpis = [
        promedio && `Promedio: ${promedio}`,
        total && `Total: ${total}`
    ].filter(Boolean);

    return {
        titulo: container.querySelector('h2, h3')?.textContent?.trim() || `Reporte de ${combinacion}`,
        nombreArchivo: `${combinacion.toLowerCase()}-reporte`,
        headers,
        rows,
        kpis
    };
};

const generarPDF = (datos) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const y = 18;

    doc.setFontSize(16).text(datos.titulo, 14, y);

    if (datos.kpis.length) {
        doc.setFontSize(10).text(datos.kpis.join('   |   '), 14, y + 8);
    }

    autoTable(doc, {
        startY: y + 15,
        head: [datos.headers],
        body: datos.rows,
        theme: 'striped',
        headStyles: { fillColor: [0, 85, 164] },
        styles: { fontSize: 9 }
    });

    doc.save(`${datos.nombreArchivo}.pdf`);
};

const generarExcel = (datos) => {
    const celdaCSV = (val = '') => `"${String(val).replace(/"/g, '""')}"`;

    const lineas = [
        [celdaCSV('Reporte:'), celdaCSV(datos.titulo)],
        ...datos.kpis.map(kpi => kpi.split(': ').map(celdaCSV)),
        [],
        datos.headers.map(celdaCSV),
        ...datos.rows.map(row => row.map(celdaCSV))
    ];

    const csvContent = '\uFEFF' + lineas.map(e => e.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${datos.nombreArchivo}.csv`;
    link.click();
};

// ========== COMPONENTE ==========

const ReportesExportActions = ({ contenedorRef, combinacion }) => {
    const exportar = (formato) => {
        const datos = extraerDatos(contenedorRef?.current, combinacion);

        if (!datos) {
            alert('⚠️ No hay datos visibles en la tabla para exportar.');
            return;
        }

        formato === 'pdf' ? generarPDF(datos) : generarExcel(datos);
    };

    return (
        <div className="export-actions">
            <button className="btn-export btn-pdf" onClick={() => exportar('pdf')}>
                📄 Exportar PDF
            </button>
            <button className="btn-export btn-excel" onClick={() => exportar('excel')}>
                📊 Exportar Excel
            </button>
        </div>
    );
};

export default ReportesExportActions;