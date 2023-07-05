import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit, OnDestroy {

  turnos:any[] = [];
  user:any = {};

  esPaciente!:boolean;
  esEspecialista!:boolean;

  arrayTurnosFiltro:any[] = []
  arrayEspecialistas:any[] = [];
  arrayEspecialidades:any[] = [];
  arrayPacientes:any[] = [];

  especialidadSeleccionada:string = '';
  pacienteSeleccionado:any = null;
  especialistaSeleccionado:any = null;

  mostrarFiltro:string='';

  loading:boolean = false;
 
  constructor(private auth:AuthService, private db:DatabaseService, private toast:ToastService) { }

  ngOnInit(): void {

    this.auth.userData.subscribe((res:any) => {
        this.user = res;

        if(this.user.perfil == 'paciente') {

          this.esPaciente = true;
          this.esEspecialista = false;

          this.db.getTurnosByPaciente(this.user.uid).subscribe((res:any) => {

            this.turnos = res;
            this.arrayTurnosFiltro = res;
            console.log('turnos', this.turnos);

            this.turnos.forEach((t:any) => {
              if(!this.arrayEspecialidades.includes(t.especialidad)) {
                this.arrayEspecialidades.push(t.especialidad);
              }

              if(!this.arrayEspecialistas.some(esp => esp.uid === t.uidEspecialista)) {
                this.arrayEspecialistas.push({uid:t.uidEspecialista, nombre:t.nombreEspecialista})
              }
            });
          });
        }
        else if(this.user.perfil == 'especialista') {

          this.esEspecialista = true;
          this.esPaciente = false;

          this.db.getTurnosByEspecialista(this.user.uid).subscribe((res:any) => {

            this.turnos = res;
            this.arrayTurnosFiltro = res;
            console.log('turnos', this.turnos);

            this.turnos.forEach((t:any) => {
              if(!this.arrayEspecialidades.includes(t.especialidad)) {
                this.arrayEspecialidades.push(t.especialidad);
              }

              if(!this.arrayPacientes.some(pac => pac.uid === t.uidPaciente)) {
                this.arrayPacientes.push({uid:t.uidPaciente, nombre:t.nombrePaciente})
              }
            });
          });
        }

    });
  }

  ngOnDestroy(): void {
    
  }

  onClickFiltro(queFiltro:string) {
    if(queFiltro == 'especialidad') {
      this.mostrarFiltro = 'especialidad';
      this.especialidadSeleccionada = '';
      this.especialistaSeleccionado = null;
      this.pacienteSeleccionado = null;
      this.arrayTurnosFiltro = this.turnos.slice();
    }
    else if(queFiltro == 'especialista') {
      this.mostrarFiltro = 'especialista';
      this.especialidadSeleccionada = '';
      this.especialistaSeleccionado = null;
      this.pacienteSeleccionado = null;
      this.arrayTurnosFiltro = this.turnos.slice();
    }
    else if(queFiltro == 'paciente') {
      this.mostrarFiltro = 'paciente';
      this.especialidadSeleccionada = '';
      this.especialistaSeleccionado = null;
      this.pacienteSeleccionado = null;
      this.arrayTurnosFiltro = this.turnos.slice();
    }
  }

  onClickFiltroEspecialidad(especialidad:string) {

    if(this.especialidadSeleccionada == especialidad) {
      this.especialidadSeleccionada = '';
      this.arrayTurnosFiltro = this.turnos.slice();
    }
    else {
      this.especialidadSeleccionada = especialidad;
      this.arrayTurnosFiltro = this.turnos.filter(t => t.especialidad == especialidad);
      console.log('filtro', this.arrayTurnosFiltro);
    }

  }

  onClickFiltroEspecialista(uid:string) {

    if(this.especialistaSeleccionado == uid) {
      this.especialistaSeleccionado = null;
      this.arrayTurnosFiltro = this.turnos.slice();
    }
    else {
      this.especialistaSeleccionado = uid;
      this.arrayTurnosFiltro = this.turnos.filter(t => t.uidEspecialista == uid);
      console.log('filtro', this.arrayTurnosFiltro);
    }

  }

  onClickFiltroPaciente(uid:string) {

    if(this.pacienteSeleccionado == uid) {
      this.pacienteSeleccionado = null;
      this.arrayTurnosFiltro = this.turnos.slice();
    }
    else {
      this.pacienteSeleccionado = uid;
      this.arrayTurnosFiltro = this.turnos.filter(t => t.uidPaciente == uid);
      console.log('filtro', this.arrayTurnosFiltro);
    }

    
  }

}

