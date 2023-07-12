import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { SeleccionUsuariosComponent } from './pages/seleccion-usuarios/seleccion-usuarios.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { AdminGuard } from './guards/admin.guard';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { InformesComponent } from './pages/informes/informes.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';

const routes: Routes = [
  { 
    path: '', component:BienvenidaComponent, data: {animation: 'Home'}
  }, 
  { 
    path: 'registro', component:RegistroComponent,  
  },
  { 
    path: 'login', component:LoginComponent, data: {animation: 'Login'} 
  },
  { 
    path: 'seleccion-usuarios', component:SeleccionUsuariosComponent,  
    canActivate: [AdminGuard] 
  },
  { 
    path: 'mis-turnos', component:MisTurnosComponent,   
  },
  { 
    path: 'mi-perfil', component:MiPerfilComponent, data: {animation: 'Usuario'}
  },
  { 
    path: 'solicitar-turno', component:SolicitarTurnoComponent,  
  },
  { 
    path: 'turnos', component:TurnosComponent,
    canActivate: [AdminGuard] 
  },
  {
    path: 'pacientes', component:PacientesComponent,  
  },
  {
    path: 'informes', component:InformesComponent,  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
