import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroPacienteComponent } from './components/registro-paciente/registro-paciente.component';
import { RegistroEspecialistaComponent } from './components/registro-especialista/registro-especialista.component';
import { SeleccionUsuariosComponent } from './pages/seleccion-usuarios/seleccion-usuarios.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RecaptchaFormsModule, RecaptchaModule } from "ng-recaptcha";
import { RegistroAdminComponent } from './components/registro-admin/registro-admin.component';
import { AltasAdminComponent } from './components/altas-admin/altas-admin.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { MisHorariosComponent } from './components/mis-horarios/mis-horarios.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { InformesComponent } from './pages/informes/informes.component';
import { ShortDatePipe } from './pipes/short-date.pipe';
import { TimeAmPmPipe } from './pipes/time-am-pm.pipe';
import { LongDateEspPipe } from './pipes/long-date-esp.pipe';
import { ButtonDirective } from './directives/button.directive';
import { CardDirective } from './directives/card.directive';
import { LogoDirective } from './directives/logo.directive';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    NavbarComponent,
    RegistroComponent,
    LoginComponent,
    RegistroPacienteComponent,
    RegistroEspecialistaComponent,
    SeleccionUsuariosComponent,
    RegistroAdminComponent,
    AltasAdminComponent,
    MisTurnosComponent,
    SolicitarTurnoComponent,
    MiPerfilComponent,
    MisHorariosComponent,
    TurnosComponent,
    PacientesComponent,
    InformesComponent,
    ShortDatePipe,
    TimeAmPmPipe,
    LongDateEspPipe,
    ButtonDirective,
    CardDirective,
    LogoDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    ToastrModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [{provide: FIREBASE_OPTIONS, useValue: environment.firebase}],
  bootstrap: [AppComponent]
})
export class AppModule { }
