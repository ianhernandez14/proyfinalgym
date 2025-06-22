import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActividadCardComponent } from '../actividad-card/actividad-card.component';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { InscripcionService } from '../../services/inscripcion.service';
import { CorreoService } from '../../services/correo.service';
import { Inscripcion } from '../../models/inscripcionModel';  

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ActividadCardComponent, MatSnackBarModule],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent {
  currentYear = new Date().getFullYear();
  months: any[] = [];
  horarioForm!: FormGroup;
  formEnviado = false;
  mostrarAlerta = false;
  inscripcionesUsuario: any[] = [];
  currentUser: any = null;
  esAdmin: boolean = false;
  estaLogueado: boolean = false;
  resumenInscripcion: any = null;
  loading: boolean = false;


  actividades = [
    { imagen: 'boxeo.jpg', titulo: 'Boxeo', horario: 'De lunes a domingo: 5 pm - 10 pm' },
    { imagen: 'mma.jpg', titulo: 'MMA', horario: 'De lunes a viernes: 3 pm - 7 pm' },
    { imagen: 'zumba.jpg', titulo: 'Zumba', horario: 'De viernes a domingo: 7 am - 2 pm' },
    { imagen: 'pesas.jpg', titulo: 'Pesas', horario: 'Lunes a domingo: 6 am - 10 pm' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private inscripcionService: InscripcionService,
    private correoService: CorreoService
  ){}

  ngOnInit() {
    const userInStorage = localStorage.getItem('currentUser');
    this.currentUser = this.authService.getCurrentUser();
    this.esAdmin = this.currentUser?.tipo_usuario === "admin";
    this.estaLogueado = !!userInStorage && !!this.currentUser;

    console.log(this.esAdmin);
    this.generateMonths();
    
    if (this.estaLogueado) {
      this.cargarInscripcionesUsuario();
    }

    this.horarioForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      activity: ['', Validators.required],
      preferredTime: [''],
      peopleCount: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      comments: [''],
      terms: [false, Validators.requiredTrue]
    });
  }

     
  fechaNoPasadaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    try {
      const fechaSeleccionada = new Date(control.value);
      const hoy = new Date();
      
      // Normalizamos las fechas para comparar solo día, mes y año
      const fechaSel = new Date(fechaSeleccionada.getFullYear(), fechaSeleccionada.getMonth(), fechaSeleccionada.getDate());
      const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      

      if (fechaSel < fechaHoy) {

        return { 'fechaPasada': true };
      }
      return null;
    } catch (error) {
      console.error('Error al validar fecha:', error);
      return { 'fechaInvalida': true };
    }
  }

  generateMonths() {
    this.months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(this.currentYear, i, 1);
      return {
        name: date.toLocaleString('es-ES', { month: 'long' }),
        days: Array.from({ length: new Date(this.currentYear, i + 1, 0).getDate() }, (_, k) => k + 1),
        firstDayIndex: new Date(this.currentYear, i, 1).getDay(),
        index: i
      };
    });
  }

  getEmptyDays(firstDayIndex: number): any[] {
    return Array(firstDayIndex > 0 ? firstDayIndex - 1 : 6).fill(0);
  }

  isToday(day: number, monthIndex: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      monthIndex === today.getMonth() &&
      this.currentYear === today.getFullYear()
    );
  }

  isWeekend(day: number, monthIndex: number): boolean {
    
    const dayOfWeek = new Date(this.currentYear, monthIndex, day).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  changeYear(offset: number): void {
    this.currentYear += offset;
    this.generateMonths();
  }
  preventTyping(event: KeyboardEvent): void {
  event.preventDefault();
}

  eliminarInscripcion(id: number | string): void {
    this.inscripcionService.eliminar(id.toString()).subscribe(() => {
      this.cargarInscripcionesUsuario();
      this.snackBar.open('¡Inscripción eliminada!', 'Cerrar', { duration: 2500 });
    }, error => console.error(error));  
  }



editarInscripcion(inscripcion: any): void {
  this.horarioForm.patchValue({
    fullName: inscripcion.fullName,
    email: inscripcion.email,
    phone: inscripcion.phone,
    dob: inscripcion.dob,
    activity: inscripcion.activity,
    preferredTime: inscripcion.preferredTime,
    peopleCount: inscripcion.peopleCount,
    comments: inscripcion.comments,
    terms: true // O como corresponda
  });
  // Opcional: podrías guardar el id para actualizar en vez de crear uno nuevo al guardar
  this.editandoId = inscripcion.id;
}


  onSubmit(): void {
this.loading = true;
 this.resumenInscripcion = { ...this.horarioForm.value };

    if (this.horarioForm.invalid) {
      return;
    }
   

    const formData = this.horarioForm.value;

  this.correoService.enviarCorreo({
    email: formData.email,
    fullName: formData.fullName
  }).subscribe({
    next: res => {
      console.log('Correo enviado');
    },
    error: err => {
      console.error('Error al enviar correo', err);
    }
  });

  

  
  
  const inscripcion = {
      ...this.horarioForm.value,
      fechaInscripcion: new Date().toISOString(), 
      year: this.currentYear,
      username: this.currentUser ? this.currentUser.nombre_completo : null   
  };

  const inscripcionesStorage = localStorage.getItem('inscripciones');
  let inscripciones = inscripcionesStorage ? JSON.parse(inscripcionesStorage) : [];

  if (this.editandoId) {
    this.inscripcionService.actualizar(this.editandoId,inscripcion).subscribe(()=>{
      this.snackBar.open('¡Inscripción actualizada!','Cerrar',{duration:2500});
      this.cargarInscripcionesUsuario();
      this.editandoId=null;
      this.horarioForm.reset();
       location.reload();
    },error=>error.console(error));
  } else {
    this.inscripcionService.crear(inscripcion).subscribe(()=>{
      this.snackBar.open('¡Inscripción Creada!','Cerrar',{duration:2500});
      this.cargarInscripcionesUsuario();
      this.horarioForm.reset();
      location.reload();
    },error=>console.error(error));
  
  }

  localStorage.setItem('inscripciones', JSON.stringify(inscripciones));

  this.mostrarAlerta = true;
  this.formEnviado = true;

  this.snackBar.open('¡Inscripción enviada correctamente!', 'Cerrar', {
    duration: 2500,
    panelClass: ['snackbar-grande-verde']
  });

}

 cargarInscripcionesUsuario(): void {
  this.inscripcionService.obtenerTodas().subscribe(data=>{
    this.inscripcionesUsuario=data;
  },error=>console.error(error));
}
  
  getCurrentDate(): string {
  const hoy = new Date();
  const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
  const dia = hoy.getDate().toString().padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

editandoId: number | null = null;


onActividadSeleccionada(actividad: { imagen: string; titulo: string; horario: string }) {
  // Normaliza el valor para que coincida con el select
  let value = '';
  switch (actividad.titulo.toLowerCase()) {
    case 'boxeo':
      value = 'boxeo';
      break;
    case 'mma':
      value = 'mma';
      break;
    case 'zumba':
      value = 'zumba';
      break;
    case 'pesas':
      value = 'pesas';
      break;
    default:
      value = '';
  }

  this.horarioForm.patchValue({
    activity: value
  });

  this.mostrarAlerta = true;
  setTimeout(() => {
    this.mostrarAlerta = false;
  }, 2000);
}
}


