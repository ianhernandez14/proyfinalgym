import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule, MatSnackBarModule],
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

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void
  {
    this.currentUser = this.authService.getCurrentUser();
    this.cargarMensajes();
  }

  onSubmit(formulario: any): void
  {
    if (formulario.invalid) return;

    const mensaje = {
      id: this.editandoId ? this.editandoId : Date.now(),
      ...this.contacto,
      fecha: new Date().toISOString(),
      username: this.currentUser ? this.currentUser.username : null
    };

    const mensajesStorage = localStorage.getItem('mensajesContacto');
    let mensajes = mensajesStorage ? JSON.parse(mensajesStorage) : [];

    if (this.editandoId)
    {
      mensajes = mensajes.map((m: any) => m.id === this.editandoId ? mensaje : m);
      this.editandoId = null;
    }
    else
    {
      mensajes.push(mensaje);
    }

    localStorage.setItem('mensajesContacto', JSON.stringify(mensajes));

    formulario.resetForm();
    this.cargarMensajes();

    this.formEnviado = true;
    setTimeout(() =>
    {
      this.formEnviado = false;
    }, 3000);

    this.snackBar.open('¡Mensaje enviado correctamente!', 'Cerrar', {
      duration: 2500,
      panelClass: ['snackbar-grande-verde']
    });
  }

  cargarMensajes(): void
  {
    const mensajesStorage = localStorage.getItem('mensajesContacto');
    this.mensajes = mensajesStorage ? JSON.parse(mensajesStorage) : [];
  }

  eliminarMensaje(id: number): void
  {
    let mensajes = this.mensajes.filter((m: any) => m.id !== id);
    localStorage.setItem('mensajesContacto', JSON.stringify(mensajes));
    this.cargarMensajes();
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
