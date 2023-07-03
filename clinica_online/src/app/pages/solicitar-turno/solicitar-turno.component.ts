import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent implements OnInit, OnDestroy {
  
  turnosEspecialista:any[] = [];
  horariosDeInicioDeTurnos:any[] = [];
  diasEspecialista:any[] = [];
  especialistas:any[] = [];
  especialistasFiltro:any[] = [];
  user:any = null;
  especialidadSeleccionada:string='';
  especialistaSeleccionadoDB!:any;
  especialistaSeleccionado!:string|null;
  fechaSeleccionada!:Date|null;
  horarioSeleccionado!:string|null;
  dias:Date[] = [];

  especialidades:any[] = [
    {nombre: 'Cardiologia', img:'assets/img/especialidades/cardiologia.png' },
    {nombre: 'Electrofisiologia', img:'assets/img/especialidades/heart-beat.png' },
    {nombre: 'Neurologia', img:'assets/img/especialidades/neurology.png' },
    {nombre: 'Traumatologia', img:'assets/img/especialidades/orthopedics.png' },
    {nombre: 'Odontologia', img:'assets/img/especialidades/dental.png' }
  ];

  loading:boolean = false;

  subscription!:Subscription;
  subscriptionEspecialistas!:Subscription;
  
  constructor(private auth:AuthService, private db:DatabaseService, private toast:ToastService) { }

  ngOnInit(): void {

    this.dias = this.getDatesBetween();

    this.subscription = this.auth.userData.subscribe((res:any) => {
      if(res) {
        this.user = res;
      }
    });

    this.subscriptionEspecialistas = this.db.getEspecialistas().subscribe((res:any) => {
      if(res) {
        this.especialistas = res.filter((esp:any) => esp.habilitado === true);
      }
    });
  }

  async filtrarEspecialistasPorEspecialidad() {
    if(this.especialistas != null) {
      this.especialistasFiltro = this.especialistas.filter((especialista:any) => especialista.especialidad.includes(this.especialidadSeleccionada));
    }
  }

  ngOnDestroy(): void {
    if(this.subscription != null) {
      this.subscription.unsubscribe();
    }
    if(this.subscriptionEspecialistas != null) {
      this.subscriptionEspecialistas.unsubscribe();
    }
  }

  onClickSeleccionarEsp(esp:string) {
    this.especialistaSeleccionado = null;
    this.especialidadSeleccionada = esp;
    this.filtrarEspecialistasPorEspecialidad();
  }

  onClickSeleccionarDoc(uidDoc:string) {
    this.especialistaSeleccionado = uidDoc;

    this.db.getUserByUid(uidDoc).subscribe((res:any) => {

      this.especialistaSeleccionadoDB = res;

      res.horarios.dias.forEach((dia:any) => {
        if(dia == 'Lunes' && !this.diasEspecialista.includes('Mon')) {
          this.diasEspecialista.push('Mon');
        }
        else if(dia == 'Martes' && !this.diasEspecialista.includes('Tue')) {
          this.diasEspecialista.push('Tue');
        }
        else if(dia == 'Miercoles' && !this.diasEspecialista.includes('Wed')) {
          this.diasEspecialista.push('Wed');
        }
        else if(dia == 'Jueves' && !this.diasEspecialista.includes('Thu')) {
          this.diasEspecialista.push('Thu');
        }
        else if(dia == 'Viernes' && !this.diasEspecialista.includes('Fri')) {
          this.diasEspecialista.push('Fri');
        }
        else if(dia == 'Sabado' && !this.diasEspecialista.includes('Sat')) {
          this.diasEspecialista.push('Sat');
        }

      });

      /*
      setTimeout(() => {
        this.generarTurnos();
      }, 1000);
      */
      this.generarTurnos();
    });
    /*
    this.db.getTurnosByEspecialista(uidDoc).subscribe((turnos:any) => {
      this.turnosEspecialista = turnos;
    });
    */
  }

  onClickFecha(dia:any) {
    this.horarioSeleccionado = null;
    this.fechaSeleccionada = dia;
    console.log(this.fechaSeleccionada);

    this.mostrarHorarios();
  }

  onClickHorario(hora:string) {
    this.horarioSeleccionado = hora;
    console.log(this.horarioSeleccionado);
  }

  mostrarTurnos() {
    /*
    if(this.especialistaSeleccionado != null ) {
      this.db.getTurnosByEspecialista(this.especialistaSeleccionado).subscribe((turnos:any) => {

      });
    }
    */
  }

  mostrarHorarios() {
    this.horariosDeInicioDeTurnos = [];
    if(this.fechaSeleccionada != null) {
      
      let inicio = this.especialistaSeleccionadoDB.horarios.horarioInicio.split(':');
      let fin = this.especialistaSeleccionadoDB.horarios.horarioFin.split(':');
      let duracion = this.especialistaSeleccionadoDB.horarios.duracionTurnos;

      let inicioEnMinutos:number = parseInt(inicio[0]) * 60 + parseInt(inicio[1]);
      let finEnMinutos:number = parseInt(fin[0]) * 60 + parseInt(fin[1]);

      console.log(inicioEnMinutos);
      console.log(finEnMinutos);
      console.log(duracion);

      for(let i = inicioEnMinutos; i < finEnMinutos; i += duracion) {
        let horasYMinutos = this.toHoursAndMinutes(i);
        console.log(horasYMinutos);
        this.horariosDeInicioDeTurnos.push(horasYMinutos);
      }
    }
  }

  toHoursAndMinutes(totalMinutes:number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0': ''}${minutes}`;
  }

  generarTurnos() {
    if(this.dias != null) {

      let nombreDia:string;

      this.dias.forEach((dia:Date) => {

        let array:string[] = dia.toDateString().split(' ');

        nombreDia = array[0];
        console.log(nombreDia);

        if(!this.diasEspecialista.includes(nombreDia)) {
          let index = this.dias.indexOf(dia);
          this.dias.splice(index, 1);
        }
      });
    }
  }

  getDatesBetween() {
    let dates = [];
    let currentDate:Date = new Date(Date.now());
    let today:any = new Date(currentDate).toDateString();
    let endDate:Date = new Date(today);
    
    endDate.setDate(currentDate.getDate() + 15);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(dates);
    return dates;
  };
}
