import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Define la interfaz User (asegúrate de tenerla en tu proyecto)
interface User {
  id?: string;
  email: string;
  password: string;
  nombre_completo: string;
  tipo_usuario: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private apiUrl = 'http://localhost:3000/api/usuarios';
  private currentUser: User | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<User | null>
  {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const user = localStorage.getItem('currentUser');
      this.currentUser = user ? JSON.parse(user) : null;
    }
    return this.currentUser;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.tipo_usuario === 'admin';
  }
}