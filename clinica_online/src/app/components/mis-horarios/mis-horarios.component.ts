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
  arrayDiasSeleccionados:string[] = [];

  loading:boolean = false;

  subscription!:Subscription;

  constructor(private auth:AuthService, private db:DatabaseService, private toast:ToastService) { }

  ngOnInit(): void {

      this.subscription = this.auth.userData.subscribe((res:any) => {
        if(res) {
          this.user = res;
          console.log('user mis horarios', this.user);
  
          this.arrayDiasSeleccionados = this.user.horarios.dias;
          this.duracion = this.user.horarios.duracionTurnos;
          this.inicio = this.user.horarios.horarioInicio;
          this.fin = this.user.horarios.horarioFin;
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
          duracionTurnos: this.duracion,
          //uid: this.user.uid
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

        this.db.updateHorariosEspecialista(horarios, this.user.uid).then(() => {
          this.toast.showSuccess('Horarios actualizados', mensaje);
          this.loading = false;
        }).catch((err) => {
          this.toast.showError('Ocurrió un problema');
          console.log(err);
          this.loading = false;
        });
      
      }
    }
    else {
      this.toast.showError('Revise los campos', 'Hay campos incompletos o erróneos.');
    }
  }


}
