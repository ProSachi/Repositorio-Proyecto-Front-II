import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { profesorService } from "../../services/profesorService";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ReporteC2Profesor = () => {
const [profesores, setProfesores] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState("");

const [busqueda, setBusqueda] = useState("");
const [sortConfig, setSortConfig] = useState({
key: null,
direction: "asc",
});

useEffect(() => {
const cargarProfesores = async () => {
setCargando(true);
setError("");

try {
const data = await profesorService.listarTodos();

const profesoresTransformados = (data || []).map((profesor) => ({
nombre: profesor.nombreCompleto || profesor.nombre || "Sin nombre",
materia:
profesor.areasAsignadas ||
profesor.especialidad ||
"Sin materia",
promedio: Number(profesor.promedio ?? profesor.calificacion ?? 0),
}));

setProfesores(profesoresTransformados);
} catch {
setError(
"No se pudieron cargar los profesores. Verifica la conexión con el backend."
);
} finally {
setCargando(false);
}
};

cargarProfesores();
}, []);

const profesoresFiltrados = profesores.filter(
(prof) =>
prof.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
prof.materia.toLowerCase().includes(busqueda.toLowerCase())
);

const profesoresOrdenados = [...profesoresFiltrados].sort((a, b) => {
if (!sortConfig.key) return 0;

if (sortConfig.key === "promedio") {
return sortConfig.direction === "asc"
? a.promedio - b.promedio
: b.promedio - a.promedio;
}

const valA = a[sortConfig.key].toLowerCase();
const valB = b[sortConfig.key].toLowerCase();

if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;

return 0;
});

const promedioGeneral =
profesoresOrdenados.reduce((acc, prof) => acc + prof.promedio, 0) /
(profesoresOrdenados.length || 1);

const materias = [...new Set(profesoresOrdenados.map((p) => p.materia))];

const promedioPorMateria = materias.map((materia) => {
const profesoresMateria = profesoresOrdenados.filter(
(prof) => prof.materia === materia
);

const promedioMateria =
profesoresMateria.reduce((acc, prof) => acc + prof.promedio, 0) /
profesoresMateria.length;

return promedioMateria;
});

const totalPromedios = promedioPorMateria.reduce(
(acc, valor) => acc + valor,
0
);

const porcentajes =
totalPromedios > 0
? promedioPorMateria.map((promedio) =>
Number(((promedio / totalPromedios) * 100).toFixed(2))
)
: promedioPorMateria.map(() => 0);

const dataPie = {
labels: materias,
datasets: [
{
data: porcentajes,
backgroundColor: [
"#E71D73",
"#CDF42A",
"#FDB913",
"#dc3545",
"#6f42c1",
"#17a2b8",
],
},
],
};

const optionsPie = {
plugins: {
legend: {
position: "bottom",
labels: {
boxWidth: 20,
padding: 15,
},
},
datalabels: {
color: "#010101",
formatter: (value) => `${value}%`,
font: {
weight: "bold",
size: 9,
},
},
tooltip: {
callbacks: {
label: (context) => `${context.label}: ${context.raw}%`,
},
},
},
};

const handleSort = (key) => {
let direction = "asc";

if (sortConfig.key === key && sortConfig.direction === "asc") {
direction = "desc";
}

setSortConfig({ key, direction });
};

return (
<div
style={{
padding: "1.5rem",
backgroundColor: "white",
borderRadius: "12px",
border: "1px solid rgba(231, 29, 115, 0.08)",
boxShadow: "var(--shadow)",
}}
>
<h3
style={{
color: "var(--color-dark)",
marginBottom: "0.5rem",
}}
>
Reporte C2 - Notas por Profesor
</h3>

<p
style={{
marginBottom: "1rem",
color: "#555",
}}
>
Consulta del promedio de notas por profesor y promedio general.
</p>

<div
style={{
display: "flex",
alignItems: "center",
marginBottom: "1.5rem",
gap: "2rem",
flexWrap: "wrap",
}}
>
<div
style={{
flex: 1,
minWidth: "250px",
}}
>
<input
type="text"
placeholder="Filtrar por nombre o materia..."
value={busqueda}
onChange={(e) => setBusqueda(e.target.value)}
style={{
marginBottom: "1rem",
padding: "10px",
borderRadius: "8px",
border: "2px solid rgba(231, 29, 115, 0.15)",
width: "100%",
color: "var(--color-dark)",
outline: "none",
}}
/>
</div>

<div
style={{
width: "250px",
}}
>
{!cargando && !error && materias.length > 0 && (
<Pie data={dataPie} options={optionsPie} />
)}
</div>
</div>

{cargando && (
<p
style={{
marginBottom: "1rem",
}}
>
Cargando profesores...
</p>
)}

{error && (
<p
style={{
marginBottom: "1rem",
color: "#b42318",
}}
>
{error}
</p>
)}

<div
style={{
marginBottom: "1rem",
fontWeight: "bold",
color: "#2d2d2d",
}}
>
Promedio general de profesores:{" "}
<strong
style={{
    color: "#E71D73",
}}
>
{promedioGeneral.toFixed(2)}
</strong>
</div>

{!cargando && !error && (
<table
style={{
width: "100%",
borderCollapse: "collapse",
backgroundColor: "#fff",
borderRadius: "8px",
overflow: "hidden",
}}
>
<thead
style={{
backgroundColor: "#E71D73"
}}
>
<tr>
<th
onClick={() => handleSort("nombre")}
style={{
cursor: "pointer",
padding: "12px",
textAlign: "left",
color: "white",
borderBottom: "none",
}}
>
Profesor{" "}
{sortConfig.key === "nombre"
? sortConfig.direction === "asc"
? "▲"
: "▼"
: ""}
</th>

<th
onClick={() => handleSort("materia")}
style={{
cursor: "pointer",
padding: "12px",
textAlign: "left",
color: "white",
borderBottom: "none",
}}
>
Materia{" "}
{sortConfig.key === "materia"
? sortConfig.direction === "asc"
? "▲"
: "▼"
: ""}
</th>

<th
onClick={() => handleSort("promedio")}
style={{
cursor: "pointer",
padding: "12px",
textAlign: "center",
color: "white",
borderBottom: "none",
}}
>
Promedio{" "}
{sortConfig.key === "promedio"
? sortConfig.direction === "asc"
? "▲"
: "▼"
: ""}
</th>
</tr>
</thead>

<tbody>
{profesoresOrdenados.map((prof, index) => (
<tr
key={index}
style={{
backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff",
}}
>
<td
style={{
padding: "12px",
color: "#2d2d2d",
}}
>
{prof.nombre}
</td>

<td
style={{
padding: "12px",
color: "#2d2d2d",
}}
>
{prof.materia}
</td>

<td
style={{
padding: "12px",
textAlign: "center",
fontWeight: "bold",
color: "#2d2d2d",
}}
>
{prof.promedio}
</td>
</tr>
))}
</tbody>
</table>
)}
</div>
);
};

export default ReporteC2Profesor;

