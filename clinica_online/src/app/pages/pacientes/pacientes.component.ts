import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  turnos:any[] = [];
  pacientes:any[] = [];
  uidsPacientes:string[] = [];
  pacienteSeleccionado:any = null;
  historialClinicoPacienteSeleccionado:any[] = [];
  user:any = {};

  loading:boolean = false;

  subscription!:Subscription;
  subscriptionPaciente!:Subscription;

  constructor(private auth:AuthService, private db:DatabaseService) { }

  ngOnInit(): void {

    this.auth.userData.subscribe((res:any) => {
      this.user = res;

      this.db.getTurnosByEspecialista(this.user.uid).subscribe((turnos:any) => {
        this.turnos = turnos.filter((t:any) => t.estado == 'finalizado');
        console.log('turnos', this.turnos);

        this.turnos.forEach((t:any) => {
          this.db.getUserByUid(t.uidPaciente).subscribe((paciente:any) => {
            
            if(!this.uidsPacientes.includes(paciente.uid)) {
              this.uidsPacientes.push(paciente.uid);
              this.pacientes.push(paciente);
            }
          });
        });
      });
    });
  }

  ngOnDestroy(): void {
    if(this.subscription != null) {
      this.subscription.unsubscribe();
    }
    if(this.subscriptionPaciente != null) {
      this.subscriptionPaciente.unsubscribe();
    }
  }

  mostrarPaciente(paciente:any) {
    this.pacienteSeleccionado = paciente;

    this.subscriptionPaciente = this.db.getTurnosByPaciente(paciente.uid).subscribe((res:any) => {
      this.historialClinicoPacienteSeleccionado = res.filter((t:any) => t.estado == 'finalizado');

        if(this.historialClinicoPacienteSeleccionado.length > 0) {
          console.log('historial clinico',this.historialClinicoPacienteSeleccionado);
        }
        else {
          console.log('no tiene historial clinico');
        }
    });
  }


  verResenia(resenia:string) {
    Swal.fire(
      'Reseña',
      resenia,
      'info',
    );
  }

  
}
