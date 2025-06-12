import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactoService } from '../../services/contacto.service';
import { Mensaje } from '../../services/contacto.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent{

  contacto = {
    nombre: '',
    email: '',
    mensaje: ''
  };

  formEnviado = false;
  mensajes: any[] = [];
  currentUser: any = null;
  editandoId: number | null = null;
  esAdmin: boolean = false;
  estaLogueado: boolean = false;

  equipo = [
    {
      nombre: 'Gustavo Andrés Mojica Lamas',
      imagen: 'Gustavo.jpg',
      rol: 'Desarrollador'
    },
    {
      nombre: 'Josimar Maldonado Rosales',
      imagen: 'Josimar.jpg',
      rol: 'Desarrollador'
    },
    {
      nombre: 'Ian Alejandro Hernández Aranda',
      imagen: 'Ian.jpg',
      rol: 'Desarrollador'
    }
  ];

  constructor(
  private authService: AuthService,
  private snackBar: MatSnackBar,
  private contactoService: ContactoService
) {}

  ngOnInit(): void
  {
    this.currentUser = this.authService.getCurrentUser();
    // Verificar si hay usuario en localStorage
    const userInStorage = localStorage.getItem('currentUser');
    this.estaLogueado = !!userInStorage && !!this.currentUser;

    this.esAdmin = this.currentUser?.tipo_usuario === "admin";

    if (this.estaLogueado) {
      this.cargarMensajes();
    }
  }

  onSubmit(formulario: any): void {
  if (formulario.invalid) return;

  const mensaje: Mensaje = {
    ...this.contacto,
    fecha: new Date().toISOString(),
    username: this.currentUser ? this.currentUser.username : undefined
  };

  if (this.editandoId) {
    this.contactoService.actualizarMensaje(this.editandoId, mensaje).subscribe(() => {
      this.editandoId = null;
      this.resetFormulario(formulario);
    });
  } else {
    this.contactoService.crearMensaje(mensaje).subscribe(() => {
      this.resetFormulario(formulario);
    });
  }
}
  resetFormulario(formulario: any): void {
    formulario.resetForm();
    this.cargarMensajes();

    this.formEnviado = true;
    setTimeout(() => {
      this.formEnviado = false;
    }, 3000);

    this.snackBar.open('¡Mensaje enviado correctamente!', 'Cerrar', {
      duration: 2500,
      panelClass: ['snackbar-grande-verde']
    });
  }


cargarMensajes(): void {
  if (this.esAdmin) {
    this.contactoService.obtenerMensajes().subscribe((mensajes) => {
      this.mensajes = mensajes;
    });
  }
}


  eliminarMensaje(id: number): void {
    this.contactoService.eliminarMensaje(id).subscribe(() => {
      this.cargarMensajes();
    });
  }


  editarMensaje(mensaje: any): void
  {
    this.contacto = {
      nombre: mensaje.nombre,
      email: mensaje.email,
      mensaje: mensaje.mensaje
    };
    this.editandoId = mensaje.id;
  }
}
