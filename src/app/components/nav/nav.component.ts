import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [RouterModule, UpperCasePipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  logoPath: string = 'logo2.png'; 
    esAdmin: boolean = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
   this.esAdmin = this.currentUser?.tipo_usuario === "admin";
    console.log(this.esAdmin);
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
  }
}
