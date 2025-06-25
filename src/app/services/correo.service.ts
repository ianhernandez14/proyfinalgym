import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CorreoService {
  private apiUrl = 'https://proyfinalgym-back.onrender.com/api/enviar-correo';

  constructor(private http: HttpClient) {}

  enviarCorreo(data: { email: string; fullName: string }) {
    return this.http.post(this.apiUrl, data);
  }
}