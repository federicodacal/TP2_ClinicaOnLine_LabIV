import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent {

  turnos:any[] = [];
  user:any = {};

  esPaciente!:boolean;
  esEspecialista!:boolean;

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
          });
        }
        else if(this.user.perfil == 'especialista') {
          this.esEspecialista = true;
          this.esPaciente = false;
          this.db.getTurnosByEspecialista(this.user.uid).subscribe((res:any) => {
            this.turnos = res;
          });
        }

    });

  }

}

