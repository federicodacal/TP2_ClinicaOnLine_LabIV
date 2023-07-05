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

  arrayTurnos:any[] = []
  arrayEspecialistas:any[] = [];
  arrayEspecialidades:any[] = [];
  arrayPacientes:any[] = [];

  pacienteSeleccionado:any = {};
  especialidadSeleccionada:any = {};
  especialistaSeleccionado:any = {};

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
    }
    else if(queFiltro == 'especialista') {
      this.mostrarFiltro = 'especialista';
    }
    else if(queFiltro == 'paciente') {
      this.mostrarFiltro = 'paciente';
    }
  }

  onClickFiltroEspecialidad(especialidad:string) {

  }

  onClickFiltroEspecialista(uid:string) {

  }

  onClickFiltroPaciente(uid:string) {

  }

}

