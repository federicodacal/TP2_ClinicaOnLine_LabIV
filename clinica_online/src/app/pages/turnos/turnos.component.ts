import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit, OnDestroy {

  turnos:any[] = [];

  arrayTurnosFiltro:any[] = []
  arrayEspecialistas:any[] = [];
  arrayEspecialidades:any[] = [];

  especialidadSeleccionada:string = '';
  pacienteSeleccionado:any = null;
  especialistaSeleccionado:any = null;

  uidTurnoSeleccionado:string = '';

  comentarioCancelacion:string='';

  mostrarFiltro:string='';

  subscription!:Subscription;
  
  loading:boolean = false;

  constructor(private auth:AuthService, private db:DatabaseService, private toast:ToastService) { }

  ngOnInit(): void {
    this.db.getTurnos().subscribe((res:any) => {
      if(res) {

        this.turnos = res;
        this.arrayTurnosFiltro = res;

        this.turnos.forEach((t:any) => {
          if(!this.arrayEspecialidades.includes(t.especialidad)) {
            this.arrayEspecialidades.push(t.especialidad);
          }

          if(!this.arrayEspecialistas.some(esp => esp.uid === t.uidEspecialista)) {
            this.arrayEspecialistas.push({uid:t.uidEspecialista, nombre:t.nombreEspecialista})
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if(this.subscription != null) { 
      this.subscription.unsubscribe();
    }
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

  onClickAccion(estado:string, turno:any) {
    this.uidTurnoSeleccionado = turno.uid;
    this.db.updateEstadoTurno(turno.uid, estado);
  }

  dejarComentarioCancelacionTurno() {
    if(this.uidTurnoSeleccionado != '') {
      console.log('comentario', this.comentarioCancelacion);
      this.db.updateComentarioCancelacionTurno(this.uidTurnoSeleccionado, this.comentarioCancelacion);
    }
    this.comentarioCancelacion = '';
  }

}
