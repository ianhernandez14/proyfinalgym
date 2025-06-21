import { Component, NgZone, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showWelcomeMessage: boolean = false;
  welcomeName: string = '';

  recaptchaToken: string | null = null;

  constructor(private authService: AuthService, private router: Router, private ngZone:NgZone) {}

  ngOnInit() {
    // Asignamos las funciones globales para que reCAPTCHA las llame y Angular pueda detectarlas
    (window as any).onCaptchaResolved = (token: string) => {
      // Para ejecutar dentro de Angular zone y actualizar variables reactivamente
      this.ngZone.run(() => {
        this.recaptchaToken = token;
        this.errorMessage = '';
      });
    };

    (window as any).onCaptchaExpired = () => {
      this.ngZone.run(() => {
        this.recaptchaToken = null;
        this.errorMessage = 'El reCAPTCHA ha expirado, por favor vuelve a resolverlo.';
      });
    };
  }

  onSubmit() {
    if (!this.recaptchaToken) {
      this.errorMessage = 'Por favor, verifica que no eres un robot.';
      return;
    }

    // Sigue con tu lógica normal
    this.authService.login(this.email, this.password).subscribe((user: User | null) => {
      if (user) {
        this.welcomeName = user.nombre_completo;
        this.showWelcomeMessage = true;
        this.errorMessage = '';

        setTimeout(() => {
          this.showWelcomeMessage = false;
          this.router.navigateByUrl('/index').then(() => {
            window.location.reload();
          });
        }, 3000);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.showWelcomeMessage = false;
        // También limpia el reCAPTCHA para que el usuario lo resuelva de nuevo
        this.resetRecaptcha();
      }
    });
  }

  closeWelcomeMessage() {
    this.showWelcomeMessage = false;
    this.router.navigateByUrl('/index').then(() => {
      window.location.reload();
    });
  }

  resetRecaptcha() {
    if ((window as any).grecaptcha) {
      (window as any).grecaptcha.reset();
      this.recaptchaToken = null;
    }
  }

  ngAfterViewInit() {
  if ((window as any).grecaptcha) {
    (window as any).grecaptcha.render('recaptcha', {
      sitekey: '6Lf5DGcrAAAAAOJ92gQFSdxxt3oTZ0knaq6kp2uu',
      callback: (token: string) => this.ngZone.run(() => this.onCaptchaResolved(token)),
      'expired-callback': () => this.ngZone.run(() => this.onCaptchaExpired()),
    });
  }
}

onCaptchaResolved(token: string) {
    this.recaptchaToken = token;
  }

  onCaptchaExpired() {
    this.recaptchaToken = null;
  }

  goToRegistro() {
    this.router.navigate(['/registro']);
  }
}