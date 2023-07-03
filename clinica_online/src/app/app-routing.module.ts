import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { SeleccionUsuariosComponent } from './pages/seleccion-usuarios/seleccion-usuarios.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';

const routes: Routes = [
  { path: '', component:BienvenidaComponent }, 
  { path: 'registro', component:RegistroComponent },
  { path: 'login', component:LoginComponent },
  { path: 'seleccion-usuarios', component:SeleccionUsuariosComponent },
  { path: 'mis-turnos', component:MisTurnosComponent },
  { path: 'mi-perfil', component:MiPerfilComponent },
  { path: 'solicitar-turno', component:SolicitarTurnoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
