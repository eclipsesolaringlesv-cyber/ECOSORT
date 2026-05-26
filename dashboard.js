// Carga segura del estado desde LocalStorage o inicialización por defecto
const EcoSortState = JSON.parse(
  localStorage.getItem('ecosort_v5')
) || {
  metal: 12,
  humedo: 25,
  seco: 41
};

let ecosortChart = null;
let bloqueado = false;

function initDashboard() {
  actualizarKPIs();
  crearGrafica();
}

function crearGrafica() {
  const canvas = document.getElementById('ecosortChart');
  if (!canvas) return;

  if (ecosortChart) {
    ecosortChart.destroy();
  }

  ecosortChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Metal (Inductivo)', 'Húmedo (Humedad)', 'Seco (Óptico)'],
      datasets: [{
        data: [
          EcoSortState.metal,
          EcoSortState.humedo,
          EcoSortState.seco
        ],
        backgroundColor: [
          '#334155', // Gris pizarra para metales
          '#059669', // Verde Esmeralda para orgánicos
          '#2563eb'  // Azul Royal para secos/papel
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: '#f1f5f9' },
          ticks: { font: { family: 'Inter' } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter' } }
        }
      }
    }
  });
}

function actualizarKPIs() {
  document.getElementById('count-metal').innerText = EcoSortState.metal;
  document.getElementById('count-humedo').innerText = EcoSortState.humedo;
  document.getElementById('count-seco').innerText = EcoSortState.seco;

  // Algoritmo de mitigación de CO2 (Kg salvados por unidad reciclada)
  const co2 = (EcoSortState.metal * 0.52) + (EcoSortState.humedo * 0.12) + (EcoSortState.seco * 0.24);
  document.getElementById('co2-counter').innerText = `${co2.toFixed(2)} kg`;
}

function guardarEstado() {
  localStorage.setItem('ecosort_v5', JSON.stringify(EcoSortState));
  actualizarKPIs();
  
  if (ecosortChart) {
    ecosortChart.data.datasets[0].data = [
      EcoSortState.metal,
      EcoSortState.humedo,
      EcoSortState.seco
    ];
    ecosortChart.update();
  }
}

// Simulación técnica del procesamiento físico controlado por Arduino
function procesarResiduo(tipo) {
  if (bloqueado) return;
  bloqueado = true;

  const led = document.getElementById('hardware-led');
  const disk = document.getElementById('sorting-disk');
  const icon = document.getElementById('disk-icon');
  const telemetry = document.getElementById('sensor-telemetry');

  // Estado: Leyendo Señales de Entrada de Sensores (Amarillo de espera)
  led.style.background = '#eab308';
  led.style.boxShadow = '0 0 15px #eab308';
  telemetry.innerText = 'Transmitiendo pulso del sensor...';

  setTimeout(() => {
    // Clasificación y comandos enviados al Servomotor
    if (tipo === 'metal') {
      EcoSortState.metal++;
      disk.style.transform = 'rotate(120deg)';
      icon.innerText = '⚙️';
      telemetry.innerText = 'Pulso Inductivo Alto: Metal Detectado';
    }
    if (tipo === 'humedo') {
      EcoSortState.humedo++;
      disk.style.transform = 'rotate(240deg)';
      icon.innerText = '🍎';
      telemetry.innerText = 'Humedad Crítica: Orgánico Detectado';
    }
    if (tipo === 'seco') {
      EcoSortState.seco++;
      disk.style.transform = 'rotate(360deg)';
      icon.innerText = '📄';
      telemetry.innerText = 'Sensor Óptico LDR: Residuo Seco Detectado';
    }

    // Proceso Mecánico Exitoso (Verde operacional)
    led.style.background = '#16a34a';
    led.style.boxShadow = '0 0 15px #16a34a';
    guardarEstado();

    // Retraso programado para el retorno de la compuerta física a la posición 0
    setTimeout(() => {
      disk.style.transform = 'rotate(0deg)';
      icon.innerText = '🗑️';
      telemetry.innerText = 'Servomotor reajustado. Sistema listo.';
      
      // Standby (Rojo de espera pasiva)
      led.style.background = '#ef4444';
      led.style.boxShadow = '0 0 14px #ef4444';
      bloqueado = false;
    }, 1500);

  }, 1000); // 1 segundo de retraso en análisis simulando el debounce de Arduino
}

function resetDashboard() {
  if(confirm("¿Estás seguro de reiniciar las métricas del contenedor?")) {
    EcoSortState.metal = 0;
    EcoSortState.humedo = 0;
    EcoSortState.seco = 0;
    guardarEstado();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});