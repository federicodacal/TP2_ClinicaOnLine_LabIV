import { Component } from '@angular/core';

@Component({
  selector: 'app-altas-admin',
  templateUrl: './altas-admin.component.html',
  styleUrls: ['./altas-admin.component.css']
})
export class AltasAdminComponent {
  
  iconPatient:string='assets/img/patient.png';
  iconSpecialist:string='assets/img/specialist.png';
  iconAdmin:string='assets/img/adm.png';

  tipoUsuario:string='';

  constructor() { }

  ngOnInit(): void {

  }

  
  onClickSeleccionar(tipoRegistro:string) {
    if(tipoRegistro == 'paciente') {
      this.tipoUsuario = 'PACIENTE';
    }
    else if (tipoRegistro == 'especialista') {
      this.tipoUsuario = 'ESPECIALISTA';
    }
    else if (tipoRegistro == 'administrador') {
      this.tipoUsuario = 'ADMINISTRADOR';
    }
  }
}
