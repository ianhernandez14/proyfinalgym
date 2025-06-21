import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  nombreCompleto: string = '';
  email: string = '';
  codigoPais: string = '+52';
  numeroTelefono: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  showSuccessMessage: boolean = false;
  recaptchaToken: string | null = null;

  constructor(private router: Router, private ngZone: NgZone, private authService: AuthService) {}

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

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  validateForm(): boolean {
    if (!this.nombreCompleto.trim()) {
      this.errorMessage = 'El nombre completo es requerido';
      return false;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'El correo electrónico es requerido';
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor ingrese un correo electrónico válido';
      return false;
    }

    if (!this.numeroTelefono.trim()) {
      this.errorMessage = 'El número de teléfono es requerido';
      return false;
    }

    if (!this.isValidPhone(this.numeroTelefono)) {
      this.errorMessage = 'Por favor ingrese un número de teléfono válido';
      return false;
    }

    if (!this.password) {
      this.errorMessage = 'La contraseña es requerida';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }

    if (!this.passwordsMatch()) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return false;
    }

    if (!this.recaptchaToken) {
      this.errorMessage = 'Por favor, verifica que no eres un robot.';
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    // Validar teléfono mexicano: 10 dígitos
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  onNumeroTelefonoInput(event: any) {
    let value = event.target.value;
    
    // Solo permitir números y espacios
    value = value.replace(/[^0-9\s]/g, '');
    
    // Limitar a 12 caracteres (incluyendo espacios)
    if (value.length > 12) {
      value = value.substring(0, 12);
    }
    
    // Formatear automáticamente: XX XXXX XXXX
    let cleanNumber = value.replace(/\s/g, '');
    if (cleanNumber.length >= 6) {
      value = `${cleanNumber.substring(0, 2)} ${cleanNumber.substring(2, 6)} ${cleanNumber.substring(6, 10)}`;
    } else if (cleanNumber.length >= 2) {
      value = `${cleanNumber.substring(0, 2)} ${cleanNumber.substring(2)}`;
    }
    
    this.numeroTelefono = value;
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    // Usar el servicio de autenticación para registrar el usuario
    this.authService.register({
      nombre_completo: this.nombreCompleto,
      email: this.email,
      telefono: this.getTelefonoCompleto(),
      password: this.password
    }).subscribe({
      next: (user) => {
        if (user) {
          // Registro exitoso
          console.log('Usuario registrado exitosamente:', user);
          this.showSuccessMessage = true;

          // Limpiar formulario
          this.nombreCompleto = '';
          this.email = '';
          this.numeroTelefono = '';
          this.password = '';
          this.confirmPassword = '';
          this.resetRecaptcha();

          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          // Error en el registro
          this.errorMessage = 'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
          this.resetRecaptcha();
        }
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        if (error.status === 409) {
          this.errorMessage = 'El correo electrónico ya está registrado.';
        } else {
          this.errorMessage = 'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
        }
        this.resetRecaptcha();
      }
    });
  }

  closeSuccessMessage() {
    this.showSuccessMessage = false;
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
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

  // Método para obtener el teléfono completo
  getTelefonoCompleto(): string {
    return `${this.codigoPais} ${this.numeroTelefono}`;
  }
}
