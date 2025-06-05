import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable,map } from 'rxjs';

export interface Entrenador{
  nombre:string;
  id: number;
  descripcion:string;
  edad:number;
  especialidad:string;
  image:string; 
}

@Injectable({
  providedIn: 'root'
})
export class EntrenadoresService {

  private apiUrl = 'https://infoentrenadores3.free.beeceptor.com/';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Entrenador[]> {
    return this.http.get<{ entrenadores: Entrenador[] }>(this.apiUrl).pipe(
      map(response => response.entrenadores)
    );
  }}
