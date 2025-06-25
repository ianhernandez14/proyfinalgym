import { Routes , RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';

import { EntrenadorDetalleComponent } from './components/entrenador-detalle/entrenador-detalle.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { IndexComponent } from './components/index/index.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';


export const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'servicios/:id', component: EntrenadorDetalleComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'horarios', component: HorariosComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: '**', redirectTo: '/index', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }