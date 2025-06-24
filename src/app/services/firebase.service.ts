import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private apiUrl = 'http://localhost:3000/api/firebase'; 

  constructor(private http: HttpClient) {}

  obtenerDatosDeColeccion(nombreColeccion: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${nombreColeccion}`);
  }

  //AGREGAR ESTE MÉTODO
  obtenerUltimoRegistro(nombreColeccion: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${nombreColeccion}/last`);
  }
}