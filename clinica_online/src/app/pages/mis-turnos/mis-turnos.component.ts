import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';

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

  uidTurnoSeleccionado:string = '';

  mostrarFiltro:string='';

  comentarioCancelacion:string='';
  comentarioRechazo:string='';
  reseniaTurno:string='';
  comentarioCalificacion:string='';
  calificacion:number=6;
  comentarioEncuesta:string='';

  formTurno!:FormGroup;

  altura!:number;
  peso!:number;
  temperatura!:number;
  presion!:number;

  claveDatoDinamico1:string='';
  valorDatoDinamico1:string='';

  claveDatoDinamico2:string='';
  valorDatoDinamico2:string='';

  claveDatoDinamico3:string='';
  valorDatoDinamico3:string='';

  loading:boolean = false;

  campoFiltrado:string='';
 
  constructor(private auth:AuthService, private db:DatabaseService, private toast:ToastService, private fb:FormBuilder) { }

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


          this.formTurno = this.fb.group({
            //resenia:['', [Validators.required]],
            altura:['', [Validators.required, Validators.min(0.2), Validators.max(3)]],
            peso:['', [Validators.required, Validators.min(2), Validators.max(600)]],
            temperatura:['', [Validators.required, Validators.min(1), Validators.max(60)]],
            presion:['', [Validators.required, Validators.min(1), Validators.max(200)]],
            reseniaTurno:['', [Validators.required]],
            claveDatoDinamico1:[''],
            valorDatoDinamico1:[''],
            claveDatoDinamico2:[''],
            valorDatoDinamico2:[''],
            claveDatoDinamico3:[''],
            valorDatoDinamico3:['']
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

  onClickAccion(estado:string, turno:any) {
    this.uidTurnoSeleccionado = turno.uid;

    if(estado == 'aceptado' && this.uidTurnoSeleccionado != '') {
      this.db.updateEstadoTurno(this.uidTurnoSeleccionado, 'aceptado')
      .then(() => { 
        this.toast.showSuccess('Turno actualizado', `El estado del turno fue modificado a aceptado.`);
      });
    }
  }

  
  dejarComentarioCancelacionTurno() {
    if(this.uidTurnoSeleccionado != '' && this.comentarioCancelacion != '') {

      this.db.updateEstadoTurno(this.uidTurnoSeleccionado, 'cancelado')
      .then(() => {
        this.toast.showSuccess('Turno actualizado', `El estado del turno fue modificado a cancelado.`);

        console.log('comentario', this.comentarioCancelacion);
        this.db.updateComentarioCancelacionTurno(this.uidTurnoSeleccionado, this.comentarioCancelacion).then(() => {
          this.toast.showSuccess('Comentario enviado');
        });;

      })
      .catch((err) => {
        this.toast.showError('Ocurrió un problema');
        console.log(err);
      });;

    } 
    else {
      this.toast.showWarning('No cancelado', 'Es requisito incluir un motivo de cancelación.');  
    }
    setTimeout(() => {
      this.comentarioRechazo = '';
    }, 2000);
  }

  dejarComentarioRechazoTurno() {
    if(this.uidTurnoSeleccionado != '' && this.comentarioRechazo != '') {

      this.db.updateEstadoTurno(this.uidTurnoSeleccionado, 'rechazado')
      .then(() => {
        this.toast.showSuccess('Turno actualizado', `El estado del turno fue modificado a rechazado.`);

        console.log('comentario', this.comentarioRechazo);
        this.db.updateComentarioRechazoTurno(this.uidTurnoSeleccionado, this.comentarioRechazo)
        .then(() => {
          this.toast.showSuccess('Comentario enviado');
        });;

      })
    }
    else {
      this.toast.showWarning('No rechazado', 'Es requisito incluir un motivo de rechazo.');  
    }
    setTimeout(() => {
      this.comentarioRechazo = '';
    }, 2000);
  }

  dejarComentarioEncuestaTurno() {
    if(this.uidTurnoSeleccionado != '' && this.comentarioEncuesta != '') {
      console.log('encuesta', this.comentarioEncuesta);
      this.db.updateComentarioEncuesta(this.uidTurnoSeleccionado, this.comentarioEncuesta).then(() => {
        this.toast.showSuccess('Encuesta enviada');
      });;
    }
    else {
      this.toast.showWarning('No enviado', 'Campos incompletos');  
    }
    this.comentarioEncuesta = '';
  }

  finalizarTurno() {
    if(this.uidTurnoSeleccionado != '' && this.reseniaTurno != '') {

      if(this.altura > 0 && this.altura < 3 && this.peso > 0 && this.peso < 500 && this.temperatura > 0 && this.presion > 0) {

        this.db.updateEstadoTurno(this.uidTurnoSeleccionado, 'finalizado').then(() => {

          this.toast.showSuccess('Turno actualizado', `El estado del turno fue modificado a finalizado.`);

          let arrayDatosDinamicos:any[]=[];

          if(this.claveDatoDinamico1 != '' && this.valorDatoDinamico1 != '') {
            arrayDatosDinamicos.push({clave:this.claveDatoDinamico1, valor:this.valorDatoDinamico1});

            if(this.claveDatoDinamico2 != '' && this.valorDatoDinamico2 != '') {
              arrayDatosDinamicos.push({clave:this.claveDatoDinamico2, valor:this.valorDatoDinamico2});

              if(this.claveDatoDinamico2 != '' && this.valorDatoDinamico2 != '') {
                arrayDatosDinamicos.push({clave:this.claveDatoDinamico3, valor:this.valorDatoDinamico3});
              }
            }
          }

          console.log('reseña', this.reseniaTurno);
          this.db.updateInformeTurno(this.uidTurnoSeleccionado, this.reseniaTurno, this.altura, this.peso, this.temperatura, this.presion, arrayDatosDinamicos).then(() => {
            this.toast.showSuccess('Informe enviado');
          });
        });
      }
      else {
        this.toast.showWarning('Campos incorrectos', 'Los datos ingresados deben ser válidos.');
      }
    }
    else {
      this.toast.showWarning('Campos incomplemtos', 'Es requesito enviar una reseña de la atención y los datos obligatorios.');
    }
    setTimeout(() => {
      this.altura = 0;
      this.peso = 0;
      this.temperatura = 0;
      this.presion = 0;
      this.reseniaTurno = '';
    }, 2400);
  }

  verResenia(resenia:string) {
    Swal.fire(
      'Diagnostico:',
      resenia,
      'info'
    );
  }

  valueChangedScore($event:any) {
    this.calificacion = $event.target.value;
  }

  calificarAtencion() {
    if(this.uidTurnoSeleccionado != '' && this.comentarioCalificacion) {

      console.log('comentario', this.comentarioCalificacion);
      this.db.updateCalificacionTurno(this.uidTurnoSeleccionado, this.comentarioCalificacion, this.calificacion).then(() => {
        this.toast.showSuccess('Calificación enviada');
      });;
    }
    else {
      this.toast.showWarning('No enviado', 'Es requisto añadir un comentario de calificación.')
    }
    setTimeout(() => {
      this.comentarioCalificacion = '';
      this.calificacion = 6;
    }, 2000);
  }

  buscarTurnoPorCamposPaciente() {
    this.arrayTurnosFiltro = [];
    if (this.campoFiltrado == '') {
      this.arrayTurnosFiltro = [...this.turnos];
    } else {
      const busqueda = this.campoFiltrado.trim().toLocaleLowerCase();

      for (let i = 0; i < this.turnos.length; i++) {
        const turno = this.turnos[i];

        let clave1 = ''; 
        let valor1 = '';
        let clave2 = '';
        let valor2 = '';
        let clave3 = '';
        let valor3 = '';

        if(turno.datos != undefined && turno.datos != null) {
          clave1 = turno.datos[0]?.clave.toLocaleLowerCase();
          valor1 = turno.datos[0]?.valor.toLocaleLowerCase();
          clave2 = turno.datos[1]?.clave.toLocaleLowerCase();
          valor2 = turno.datos[1]?.valor.toLocaleLowerCase();
          clave3 = turno.datos[2]?.clave.toLocaleLowerCase();
          valor3 = turno.datos[2]?.valor.toLocaleLowerCase();
        }

        if (turno.dia.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda) ||
          turno.estado.toLocaleLowerCase().includes(busqueda) ||
          turno.horario.toLocaleLowerCase().includes(busqueda) ||
          turno.nombrePaciente.toLocaleLowerCase().includes(busqueda) ||
          turno?.resenia?.toLocaleLowerCase().includes(busqueda) ||
          turno?.altura?.toString().includes(busqueda) ||
          turno?.temperatura?.toString().includes(busqueda) ||
          turno?.presion?.toString().includes(busqueda) ||
          turno?.peso?.toString().includes(busqueda) || 
          clave1!.includes(busqueda) || 
          clave2!.includes(busqueda) || 
          clave3!.includes(busqueda) || 
          valor1!.includes(busqueda) || 
          valor2!.includes(busqueda) || 
          valor3!.includes(busqueda)) 
          {
            this.arrayTurnosFiltro.push(turno);
          }
      }
    }
  }

  buscarTurnoPorCamposEspecialista() {
    this.arrayTurnosFiltro = [];
    if (this.campoFiltrado == '') {
      this.arrayTurnosFiltro = [...this.turnos];
    } else {
      const busqueda = this.campoFiltrado.trim().toLocaleLowerCase();

      for (let i = 0; i < this.turnos.length; i++) {
        const turno = this.turnos[i];

        let clave1 = ''; 
        let valor1 = '';
        let clave2 = '';
        let valor2 = '';
        let clave3 = '';
        let valor3 = '';

        if(turno.datos != undefined && turno.datos != null) {
          clave1 = turno.datos[0]?.clave.toLocaleLowerCase();
          valor1 = turno.datos[0]?.valor.toLocaleLowerCase();
          clave2 = turno.datos[1]?.clave.toLocaleLowerCase();
          valor2 = turno.datos[1]?.valor.toLocaleLowerCase();
          clave3 = turno.datos[2]?.clave.toLocaleLowerCase();
          valor3 = turno.datos[2]?.valor.toLocaleLowerCase();
        }

        if (turno.dia.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda) ||
          turno.estado.toLocaleLowerCase().includes(busqueda) ||
          turno.horario.toLocaleLowerCase().includes(busqueda) ||
          turno.nombrePaciente.toLocaleLowerCase().includes(busqueda) ||
          turno?.resenia?.toLocaleLowerCase().includes(busqueda) ||
          turno?.altura?.toString().includes(busqueda) ||
          turno?.temperatura?.toString().includes(busqueda) ||
          turno?.presion?.toString().includes(busqueda) ||
          turno?.peso?.toString().includes(busqueda) || 
          clave1!.includes(busqueda) || 
          clave2!.includes(busqueda) || 
          clave3!.includes(busqueda) || 
          valor1!.includes(busqueda) || 
          valor2!.includes(busqueda) || 
          valor3!.includes(busqueda)) 
          {
            this.arrayTurnosFiltro.push(turno);
          }
      }
    }
  }

}

