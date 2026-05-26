const EcoSortState = JSON.parse(
localStorage.getItem('ecosort_v5')
) || {
metal: 34,
humedo: 58,
seco: 92
};
let ecosortChart = null;
let bloqueado = false;
function initDashboard() {
actualizarKPIs();
crearGrafica();
}

function crearGrafica() {
const canvas = document.getElementById('ecosortChart');
if(!canvas) return;
if(ecosortChart) {
ecosortChart.destroy();
}
ecosortChart = new Chart(canvas, {
type: 'bar',
data: {
labels: [
'Metal',
'Húmedo',
'Seco'
],
datasets: [{
data: [
EcoSortState.metal,
EcoSortState.humedo,
EcoSortState.seco
],
backgroundColor: [
'#111111',
'#16a34a',
'#22c55e'
],
borderRadius: 14
}]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {

legend: {
display: false
}
},
scales: {
y: {
grid: {
color: '#e5e5e5'
}
},
x: {
grid: {
display: false
}
}
}
}
});
}
function actualizarKPIs() {
document.getElementById('count-metal').innerText = EcoSortState.metal;
document.getElementById('count-humedo').innerText = EcoSortState.humedo;
document.getElementById('count-seco').innerText = EcoSortState.seco;
const co2 =
(EcoSortState.metal * 0.45) +
(EcoSortState.humedo * 0.08) +
(EcoSortState.seco * 0.18);
document.getElementById('co2-counter').innerText =
`${co2.toFixed(1)}kg`;
}
function guardarEstado() {
localStorage.setItem(
'ecosort_v5',
JSON.stringify(EcoSortState)

);
actualizarKPIs();
if(ecosortChart) {
ecosortChart.data.datasets[0].data = [
EcoSortState.metal,
EcoSortState.humedo,
EcoSortState.seco
];
ecosortChart.update();
}
}
function procesarResiduo(tipo) {
if(bloqueado) return;
bloqueado = true;
const led = document.getElementById('hardware-led');
const disk = document.getElementById('sorting-disk');
const icon = document.getElementById('disk-icon');
const telemetry = document.getElementById('sensor-telemetry');
led.style.background = '#eab308';
led.style.boxShadow = '0 0 20px #eab308';
telemetry.innerText = 'Analizando residuo...';
setTimeout(() => {
if(tipo === 'metal') {
EcoSortState.metal++;
disk.style.transform = 'rotate(120deg)';
icon.innerText = '⚙️';
telemetry.innerText = 'Metal detectado.';
}
if(tipo === 'humedo') {
EcoSortState.humedo++;

disk.style.transform = 'rotate(240deg)';
icon.innerText = '🍎';
telemetry.innerText = 'Residuo húmedo detectado.';
}
if(tipo === 'seco') {
EcoSortState.seco++;
disk.style.transform = 'rotate(360deg)';
icon.innerText = '📄';
telemetry.innerText = 'Residuo seco detectado.';
}
led.style.background = '#16a34a';
led.style.boxShadow = '0 0 20px #16a34a';
guardarEstado();
setTimeout(() => {
disk.style.transform = 'rotate(0deg)';
icon.innerText = '🗑️';
telemetry.innerText = 'Sistema listo.';
led.style.background = '#ef4444';
led.style.boxShadow = '0 0 20px #ef4444';
bloqueado = false;
}, 1500);
}, 1000);
}
function resetDashboard() {
EcoSortState.metal = 0;
EcoSortState.humedo = 0;
EcoSortState.seco = 0;
22
guardarEstado();
}
window.addEventListener('DOMContentLoaded', () => {
initDashboard();
});