import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.css']
})
export class MisHorariosComponent implements OnInit, OnDestroy {

  user:any = null;
  especialidad!:string;
  dia:string='';
  duracion:number=60;
  inicio!:string;
  fin!:string;
  noTieneDocHorarios!:boolean;
  arrayDiasSeleccionados:string[] = [];
  horariosUser:any = null;

  loading:boolean = false;

  subscription!:Subscription;

  constructor(private auth:AuthService, private db:DatabaseService, private toast:ToastService) { }

  ngOnInit(): void {
    this.subscription = this.auth.userData.subscribe((res:any) => {
      if(res) {
        this.user = res;

        this.db.getHorariosEspecialista(res.uid).subscribe((resHor:any) => {
          if(!resHor) {
            this.noTieneDocHorarios = true;
          }
          else {
            this.horariosUser = resHor;
            this.noTieneDocHorarios = false;
            this.arrayDiasSeleccionados = resHor.dias; 
            this.duracion = resHor.duracionTurnos;
            this.inicio = resHor.horarioInicio;
            this.fin = resHor.horarioFin;
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

  onChangeDuracion($event:any) {
    if($event != null) {
      this.duracion = parseInt($event.target.value);
      console.log(this.duracion);
    }
  }

  /*
  onChangeEspecialidad(esp:string) {
    this.especialidad = esp;
    console.log(this.especialidad);
  }
  */

  onChangeDia(dia:string) {
    //this.dia = dia;
    //console.log(this.dia);
    if(this.arrayDiasSeleccionados.includes(dia)) {
      const index = this.arrayDiasSeleccionados.indexOf(dia);
      this.arrayDiasSeleccionados.splice(index, 1);
    } 
    else {
      this.arrayDiasSeleccionados.push(dia);
    }
  }

  confirmarHorario() {
    if(this.arrayDiasSeleccionados.length > 0 && this.inicio != null && this.fin != null && this.duracion != null) {

      const horaInicio = this.inicio.split(':');
      const horaFin = this.fin.split(':');

      if(horaFin[0] <= horaInicio[0]) {
        this.toast.showError('Revise los horarios', 'La hora de final no puede ser menor o igual a la de inicio.');
      }
      else {

        this.loading = true;

        const horarios = {
          dias: this.arrayDiasSeleccionados,
          horarioInicio: this.inicio,
          horarioFin: this.fin,
          nameEsp: this.user.name,
          lastNameEsp: this.user.lastName,
          duracionTurnos: this.duracion,
          uid: this.user.uid
        }

        let mensaje:string = 'Los días ';
        for(let i = 0; this.arrayDiasSeleccionados.length > i; i++) {
          if(i != this.arrayDiasSeleccionados.length-1) {
            mensaje += `${this.arrayDiasSeleccionados[i]}, `;
          }
          else {
            mensaje += `${this.arrayDiasSeleccionados[i]} `
          }
        }

        mensaje += `de ${this.inicio} hasta ${this.fin} horas. Turnos de ${this.duracion} minutos.`;

        if(this.noTieneDocHorarios) {
          this.db.addHorariosEspecialista(horarios).then(() => {
            this.toast.showSuccess('Horarios actualizados', mensaje);
            this.loading = false;
          }).catch((err) => {
            this.toast.showError('Ocurrió un problema');
            console.log(err);
            this.loading = false;
          });
        } 
        else {
          this.db.updateHorariosEspecialista(horarios).then(() => {
            this.toast.showSuccess('Horarios actualizados', mensaje);
            this.loading = false;
          }).catch((err) => {
            this.toast.showError('Ocurrió un problema');
            console.log(err);
            this.loading = false;
          });
        }
      }
    }
    else {
      this.toast.showError('Revise los campos', 'Hay campos incompletos o erróneos.');
    }
  }


}
