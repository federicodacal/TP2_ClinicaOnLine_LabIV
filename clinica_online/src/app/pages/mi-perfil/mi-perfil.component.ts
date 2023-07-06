import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  user:any = {};

  historialClinicoPaciente:any[] = [];

  view:string='mi-perfil';
  btn:string='MIS HORARIOS';

  loading:boolean = false;

  constructor(private auth:AuthService, private db:DatabaseService, private router:Router) { }

  ngOnInit(): void {

    this.loading = true;
    this.auth.userData.subscribe((res:any) => {
      this.user = res;
      console.log('user mi perfil', this.user);

      if(this.user.perfil == 'paciente') {
        this.db.getTurnosByPaciente(this.user.uid).subscribe((res:any) => {
          this.historialClinicoPaciente = res.filter((t:any) => t.estado == 'finalizado');

          console.log('historial clinico',this.historialClinicoPaciente);
        });
      }

      this.loading = false;
    });
  }

  volver() {
    this.router.navigateByUrl('');
  }

  cambiarVista() {
    if(this.view == 'horarios') {
      this.view = 'mi-perfil';
      this.btn = 'MIS HORARIOS';
    }
    else if(this.view == 'mi-perfil') {
      this.view = 'horarios';
      this.btn = 'MI PERFIL';
    }
  }

}
