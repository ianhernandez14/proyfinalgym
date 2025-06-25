import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { InscripcionService } from '../../services/inscripcion.service';

Chart.register(...registerables);



@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})


export class EstadisticasComponent implements OnInit {
  @Input() totalInscripciones: number = 0;
  
  private chart: Chart | undefined;

  constructor(private inscripcionService: InscripcionService) {}

  ngOnInit(): void {
    this.inscripcionService.getInscripcionesPorActividad().subscribe(data => {
      console.log('📊 Datos recibidos para estadística:', data);
      const labels = Object.keys(data);
      const values = Object.values(data);
      this.renderChart(labels, values);
    });
  }
renderChart(labels: string[], values: number[]) {
  new Chart("myChart", {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Inscripciones por Actividad',
        data: values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 40,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Estadísticas de Inscripciones',
          font: {
            size: 20
          }
        },
        legend: {
          display: true,
          labels: {
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.formattedValue} inscripciones`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          },
          title: {
            display: true,
            text: 'Número de Inscripciones',
            font: {
              size: 16
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Actividad',
            font: {
              size: 16
            }
          }
        }
      }
    }
  });
}
}
