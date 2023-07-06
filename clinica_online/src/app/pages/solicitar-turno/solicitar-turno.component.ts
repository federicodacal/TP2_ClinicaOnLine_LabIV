import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
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
  pacientes:any[] = [];
  especialistasFiltro:any[] = [];
  user:any = null;
  especialidadSeleccionada:string='';
  especialistaSeleccionadoDB!:any;
  especialistaSeleccionado!:string|null;
  pacienteSeleccionado:any=null;
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
  subscriptionHorariosEsp!:Subscription;
  
  constructor(private auth:AuthService, private db:DatabaseService, private toast:ToastService, private router:Router) { }

  ngOnInit(): void {

    this.loading = true;

    this.dias = this.getDatesBetween();

    this.subscription = this.auth.userData.subscribe((res:any) => {
      if(res) {
        this.user = res;
        console.log('user', this.user);

        if(res.perfil == 'administrador') {
          this.subscriptionEspecialistas = this.db.getPacientes().subscribe((res:any) => {
            if(res) {
              this.pacientes = res;
            }
          });
        }
      }
    });

    this.subscriptionEspecialistas = this.db.getEspecialistas().subscribe((res:any) => {
      if(res) {
        this.especialistas = res.filter((esp:any) => esp.habilitado === true);

        this.loading = false;
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
    if(this.subscriptionHorariosEsp != null) {
      this.subscriptionHorariosEsp.unsubscribe();
    }
  }

  onClickSeleccionarEsp(esp:string) {

    this.especialistaSeleccionado = null;
    this.fechaSeleccionada = null;
    this.horarioSeleccionado = null;
    this.especialidadSeleccionada = esp;
    this.filtrarEspecialistasPorEspecialidad();

  }

  onClickSeleccionarDoc(uidDoc:string) {

    if(this.subscriptionHorariosEsp != null) {
      this.subscriptionHorariosEsp.unsubscribe();
    }

    this.dias = [];
    this.dias = this.getDatesBetween();
    this.horarioSeleccionado = null;
    this.fechaSeleccionada = null;
    this.diasEspecialista = [];
    this.especialistaSeleccionado = uidDoc;

    this.subscriptionHorariosEsp = this.db.getUserByUid(uidDoc).subscribe((res:any) => {

      this.especialistaSeleccionadoDB = res;
      console.log('especialsita seleccionado', this.especialistaSeleccionadoDB);

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

      console.log('dias especialista', this.diasEspecialista);

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


  async mostrarHorarios() {
    this.horariosDeInicioDeTurnos = [];
    if(this.fechaSeleccionada != null && this.especialistaSeleccionado != null) {
      
      let inicio = this.especialistaSeleccionadoDB.horarios.horarioInicio.split(':');
      let fin = this.especialistaSeleccionadoDB.horarios.horarioFin.split(':');
      let duracion = this.especialistaSeleccionadoDB.horarios.duracionTurnos;

      let inicioEnMinutos:number = parseInt(inicio[0]) * 60 + parseInt(inicio[1]);
      let finEnMinutos:number = parseInt(fin[0]) * 60 + parseInt(fin[1]);

      console.log(inicioEnMinutos);
      console.log(finEnMinutos);
      console.log(duracion);

      await firstValueFrom(this.db.getTurnosByEspecialistaYFecha(this.especialistaSeleccionado,this.fechaSeleccionada.toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year:'2-digit'}))).then((res:any) => {
        this.turnosEspecialista = res;
      });  

      /*
      this.db.getTurnosByEspecialistaYFecha(this.especialistaSeleccionado, this.fechaSeleccionada.toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year:'2-digit'})).subscribe((res:any) => {
         this.turnosEspecialista = res;
        console.log('turnos del especialista en la fecha', this.turnosEspecialista);
      });
      */

      let arrayHorariosReservadosEnLaFecha: string[] = [];

      this.turnosEspecialista.forEach((t) => {
        arrayHorariosReservadosEnLaFecha.push(t.horario);
      });
      
      console.log('arrayHorariosFecha', arrayHorariosReservadosEnLaFecha);

      const fechaActual = new Date();
      const hour = fechaActual.getHours();
      const minute = fechaActual.getMinutes();
      const horaActual = `${hour}:${minute}`;

      console.log('fechaActual', fechaActual);
      console.log('horaActual', horaActual);

      for(let i = inicioEnMinutos; i < finEnMinutos; i += duracion) {
        let yaSePasoLaHora = false;
        let horasYMinutos = this.toHoursAndMinutes(i);
        console.log(horasYMinutos);

        if(this.fechaSeleccionada.toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year:'2-digit'}) == fechaActual.toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year:'2-digit'}) && horaActual > horasYMinutos) {
          yaSePasoLaHora = true;
        }

        if(!arrayHorariosReservadosEnLaFecha.includes(horasYMinutos) && !yaSePasoLaHora) {
          this.horariosDeInicioDeTurnos.push(horasYMinutos);
        }
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
  }

  confirmarTurno() {

    if(this.especialidadSeleccionada != null && this.especialistaSeleccionado != null && this.fechaSeleccionada != null && this.horarioSeleccionado != null && this.especialistaSeleccionadoDB != null) {

      if(this.user.perfil == 'paciente') {
        const turno = {
          uidEspecialista: this.especialistaSeleccionadoDB.uid,
          uidPaciente: this.user.uid, // USER ES EL PACIENTE
          nombreEspecialista: `${this.especialistaSeleccionadoDB.name} ${this.especialistaSeleccionadoDB.lastName}`,
          nombrePaciente: `${this.user.name} ${this.user.lastName}`, // USER ES EL PACIENTE
          dia: this.fechaSeleccionada.toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year:'2-digit'}), 
          especialidad: this.especialidadSeleccionada,
          estado: 'solicitado',
          horario: this.horarioSeleccionado
        };
  
        this.db.addTurno(turno).then(() => {
          this.toast.showSuccess('Turno solicitado', 'El especialista deberá confirmar turno. Por favor, aguarde.');

  
          this.router.navigateByUrl('/mis-turnos');
        })
        .catch((err) => {
          this.toast.showError('Ocurrió un problema');
          console.log(err);
        });
      }
      else if(this.user.perfil == 'administrador') { // perfil == 'administrador'

        if(this.pacienteSeleccionado != '' && this.pacienteSeleccionado != null) {
          const turno = {
            uidEspecialista: this.especialistaSeleccionadoDB.uid,
            uidPaciente: this.pacienteSeleccionado.uid, 
            nombreEspecialista: `${this.especialistaSeleccionadoDB.name} ${this.especialistaSeleccionadoDB.lastName}`,
            nombrePaciente: `${this.pacienteSeleccionado.name} ${this.pacienteSeleccionado.lastName}`, 
            dia: this.fechaSeleccionada.toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year:'2-digit'}), 
            especialidad: this.especialidadSeleccionada,
            estado: 'solicitado',
            horario: this.horarioSeleccionado
          };

          this.db.addTurno(turno).then(() => {
            this.toast.showSuccess('Turno solicitado', 'El especialista deberá confirmar turno. Por favor, aguarde.');

            
    
            this.router.navigateByUrl('/turnos');
          })
          .catch((err) => {
            this.toast.showError('Ocurrió un problema');
            
            console.log(err);
          });
        }
        else {
          this.toast.showError('Campos incompletos o erróneos', 'No hay paciente seleccionado.');
          
        }
      }
    }
    else {
      this.toast.showError('Campos incompletos o erróneos', 'Por favor, revise los campos.');
      
    }
  
  }

  onClickPaciente(paciente:any) {
    this.pacienteSeleccionado = paciente;
    console.log(this.pacienteSeleccionado);
  }
}
