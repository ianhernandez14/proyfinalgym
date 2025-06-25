import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inscripcion } from '../models/inscripcionModel';

@Injectable({ providedIn: 'root' })
export class InscripcionService {

  private API = 'http://localhost:3000/api/inscripciones';

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
  return this.http.get<{ [actividad: string]: number }>('http://localhost:3000/api/inscripciones/grafica');
}

obtenerConteoPorActividad(): Observable<Record<string, number>> {
  return this.http.get<any>('https://TU_PROYECTO.firebaseio.com/inscripciones.json').pipe(
    map((res) => {
      const conteo: Record<string, number> = {};
      for (const key in res) {
        const actividad = res[key].activity;
        if (actividad) {
          conteo[actividad] = (conteo[actividad] || 0) + 1;
        }
      }
      return conteo;
    })
  );
}

  
}