import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InscripcionService {

  private API = 'https://proyfinalgym-back.onrender.com/api/inscripciones';

  constructor(private http: HttpClient) { }

  crear(inscripcion: any): Observable<any> {
    return this.http.post(this.API, inscripcion);
  }

  obtenerTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
  
  actualizar(id: number, inscripcion: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, inscripcion);
  }


  getInscripcionesPorActividad() {
    return this.http.get<{ [actividad: string]: number }>('https://proyfinalgym-back.onrender.com/api/inscripciones/grafica');
  }
  
}