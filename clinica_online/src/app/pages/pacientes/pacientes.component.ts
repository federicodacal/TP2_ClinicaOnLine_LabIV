import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  turnos:any[] = [];
  user:any = {};

  esEspecialista!:boolean;

  arrayTurnosFiltro:any[] = []
  arrayEspecialistas:any[] = [];
  arrayEspecialidades:any[] = [];
  arrayPacientes:any[] = [];

  loading:boolean = false;

  subscription!:Subscription;

  constructor(private auth:AuthService, private db:DatabaseService) { }

  ngOnInit(): void {

    this.auth.userData.subscribe((res:any) => {
      this.user = res;

      if(this.user.perfil == 'especialista') {

        this.esEspecialista = true;

        this.subscription = this.db.getTurnos().subscribe((res:any) => {
          this.turnos = res;
          this.arrayTurnosFiltro = res;
          console.log('turnos', this.turnos);
        });

        /*
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
        */
      }
  });
  }

  ngOnDestroy(): void {
    if(this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }
}
