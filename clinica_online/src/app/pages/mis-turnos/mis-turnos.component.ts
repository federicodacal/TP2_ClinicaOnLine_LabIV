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
  esEspecialsita!:boolean;

  loading:boolean = false;
 
  constructor(private auth:AuthService, private db:DatabaseService, private toast:ToastService) { }

  ngOnInit(): void {

    this.auth.userData.subscribe((res:any) => {
        this.user = res;

        if(this.user.perfil == 'paciente') {
          this.esPaciente = true;
          this.esEspecialsita = false;
        }
        else if(this.user.perfil == 'especialista') {
          this.esEspecialsita = true;
          this.esPaciente = false;
        }

      this.db.getTurnos().subscribe((res:any) => {
        this.turnos = res;

      });

    });

  }

  

}
