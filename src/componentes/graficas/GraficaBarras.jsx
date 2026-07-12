
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const GraficaIncrementalPorMateria = ({ profesores }) => {
  if (!Array.isArray(profesores) || profesores.length === 0) {
    return <div>No hay datos</div>;
  }

  // colores de profes
  const basePastel = [
    "#21f375", "#e87624", "#df322f", "#7d36ef", "#13f2fa",
    "#14825a", "#659e08", "#6b2e05", "#041e86", "#780e0e",
    "#063d2a", "#7e108a", "#D4A5A5", "#ea1aea", "#10c08b",
  ];
 
  // lista materis y profe
  const materias = Array.from(new Set(profesores.map(p => p.materia)));
  const profesoresUnicos = Array.from(new Set(profesores.map(p => p.nombre)));
  const colorPorProfesor = {};
  profesoresUnicos.forEach((n, i) => colorPorProfesor[n] = basePastel[i % basePastel.length]);

  // ordenar materia en ascendente por profe
  const materiaToProfes = {};
  materias.forEach(m => {
    const regs = profesores
      .filter(p => p.materia === m)
      .map(r => ({ nombre: r.nombre, experiencia: Number(r.experiencia) || 0 }))
      .sort((a, b) => a.experiencia - b.experiencia);
    materiaToProfes[m] = regs;
  });

  // experiencia apilada
  const maxSegments = Math.max(...Object.values(materiaToProfes).map(arr => arr.length));
  const materiaToSegments = {};
  materias.forEach(m => {
    const regs = materiaToProfes[m];
    const segs = [];
    let prev = 0;
    for (let i = 0; i < regs.length; i++) {
      const val = regs[i].experiencia;
      segs.push(Math.max(0, val - prev));
      prev = val;
    }
    while (segs.length < maxSegments) segs.push(0);
    materiaToSegments[m] = segs;
  });

  // segmentos por profe y materia
  const datasets = [];
  for (let segIdx = 0; segIdx < maxSegments; segIdx++) {
    const data = [];
    const bgColors = [];
    materias.forEach(m => {
      const regs = materiaToProfes[m];
      if (regs[segIdx]) {
        data.push(materiaToSegments[m][segIdx]);
        bgColors.push(colorPorProfesor[regs[segIdx].nombre]);
      } else {
        data.push(0);
        bgColors.push("rgba(0,0,0,0)"); // transparente si no hay segmento
      }
    });
    datasets.push({
      label: `Segmento ${segIdx + 1}`,
      data,
      backgroundColor: bgColors,
      borderRadius: 4,
      barThickness: 36,
    });
  }

  // Datos de la grafica de barras
  const data = { labels: materias, datasets };

const options = {
  indexAxis: "x",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: "Años de experiencia por Materia",
      font: { size: 16, weight: "600" },
      padding: { top: 8, bottom: 12 },
    },
    tooltip: false, // 🔹 elimina tooltips
    datalabels: { display: false } // 🔹 elimina etiquetas dentro de las barras
  },
  scales: {
    x: { stacked: true },
    y: { stacked: true, beginAtZero: true }
  }
};

  

  // tabla lateral, sirve como leyenda
  const profesorRows = profesoresUnicos.map(name => {
    const filas = profesores.filter(p => p.nombre === name);
    return { nombre: name, color: colorPorProfesor[name], materias: filas };
  });

  return (
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
      <div style={{
       width: "95%", height: 520, background: "#fff", borderRadius: 10,
        padding: 14, boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
      }}>
        <Bar data={data} options={options} />
      </div>

      <div style={{
        width: "32%", background: "#fff", borderRadius: 10, padding: 16,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)", maxHeight: 520, overflowY: "auto"
      }}>
        <h3 style={{ margin: 0, marginBottom: 12, fontSize: 16 }}>Leyenda y datos reales</h3>

        {profesorRows.map((pr, i) => (
          <div key={i} style={{ marginBottom: 12, borderTop: "1px solid #f2f2f2", paddingTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                display: "inline-block", width: 14, height: 14,
                background: pr.color, borderRadius: 4
              }} />
              <strong style={{ fontSize: 13 }}>{pr.nombre}</strong>
            </div>
            <div style={{ marginTop: 8 }}>
              {pr.materias.map((m, idx) => (
                <div key={idx} style={{ fontSize: 13, color: "#333", display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span>{m.materia}</span>
                  <span style={{ fontWeight: 600 }}>{m.experiencia} años</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficaIncrementalPorMateria;






