import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const GraficaTorta = ({ profesores }) => {
  // Horario de jornadas
  const jornadas = ["Mañana", "Tarde", "Noche"];

  // profesores por jornada
  const conteoJornadas = jornadas.map(
    (j) => profesores.filter((p) => p.jornada === j).length
  );

  // calcula los porcentajes
  const totalProfesores = conteoJornadas.reduce((acc, val) => acc + val, 0);
  const porcentajes =
    totalProfesores > 0
      ? conteoJornadas.map((c) => Number(((c / totalProfesores) * 100).toFixed(2)))
      : jornadas.map(() => 0);

  const dataPie = {
    labels: jornadas,
    datasets: [
      {
        data: porcentajes,
        backgroundColor: ["#007bff", "#28a745", "#ffc107"],
      },
    ],
  };

  const optionsPie = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 20, padding: 15 },
      },
      datalabels: {
        color: "#fff",
        formatter: (value) => `${value}%`,
        font: { weight: "bold", size: 12 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return <Pie data={dataPie} options={optionsPie} />;
};

export default GraficaTorta;
