import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showWelcomeMessage: boolean = false;
  welcomeName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe((user: User | null) => {
      if (user) {
        this.welcomeName = user.nombre_completo;
        this.showWelcomeMessage = true;
        this.errorMessage = '';

        setTimeout(() => {
          this.showWelcomeMessage = false;
          // Redirige a /index y recarga la página
          this.router.navigateByUrl('/index').then(() => {
            window.location.reload();
          });
        }, 3000);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.showWelcomeMessage = false;
      }
    });
  }

  closeWelcomeMessage() {
    this.showWelcomeMessage = false;
    // Redirige a /index y recarga la página
    this.router.navigateByUrl('/index').then(() => {
      window.location.reload();
    });
  }
}