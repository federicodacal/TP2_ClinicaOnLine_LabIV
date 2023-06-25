import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  iconPatient:string='assets/img/patient.png';
  iconSpecialist:string='assets/img/specialist.png';

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
  }
}
