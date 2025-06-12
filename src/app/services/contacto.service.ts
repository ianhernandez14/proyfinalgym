import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mensaje {
  id?: number;
  nombre: string;
  email: string;
  mensaje: string;
  fecha?: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private apiUrl = 'http://localhost:3000/api/mensajes'; 

  constructor(private http: HttpClient) {}

  obtenerMensajes(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(this.apiUrl);
  }

  crearMensaje(mensaje: Mensaje): Observable<Mensaje> {
    return this.http.post<Mensaje>(this.apiUrl, mensaje);
  }

  eliminarMensaje(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizarMensaje(id: number, mensaje: Mensaje): Observable<Mensaje> {
    return this.http.put<Mensaje>(`${this.apiUrl}/${id}`, mensaje);
  }
}
