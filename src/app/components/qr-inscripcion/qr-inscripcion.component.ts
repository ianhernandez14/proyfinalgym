import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qr-inscripcion',
  standalone: true,
  templateUrl: './qr-inscripcion.component.html',
  imports: [CommonModule, QRCodeComponent],
})
export class QrInscripcionComponent implements OnInit {
  ultimaInscripcion: any = null;
  qrData: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.cargarUltimaInscripcion();
  }

  cargarUltimaInscripcion(): void {
    this.loading = true;
    this.error = '';
    
    this.firebaseService.obtenerUltimoRegistro('formularioInscripciones').subscribe({
      next: (data: any) => {
        this.ultimaInscripcion = data;
        this.qrData = this.generarQRData();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al obtener la inscripción:', error);
        this.error = 'Error al cargar los datos';
        this.loading = false;
      }
    });
  }

  generarQRData(): string {
    if (!this.ultimaInscripcion) return '';
    
    const i = this.ultimaInscripcion;
    
    return `=== INSCRIPCIÓN CONFIRMADA ===
  Nombre: ${i.fullName || 'N/A'}
  Email: ${i.email || 'N/A'}
  Teléfono: ${i.phone || 'N/A'}
  Fecha Seleccionada: ${i.dob || 'N/A'}
  Actividad: ${i.activity || 'N/A'}
  Horario: ${i.preferredTime || 'No especificado'}
  Comentarios: ${i.comments || 'Ninguno'}
  Fecha Inscripción: ${i.fechaInscripcion || new Date().toLocaleDateString()}
  ID: ${i.id || 'temp-id'}
  =============================`;
  }

  actualizarQR(): void {
    this.cargarUltimaInscripcion();
  }
}