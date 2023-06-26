import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css']
})
export class RegistroPacienteComponent implements OnInit {

  constructor(private auth:AuthService, private router:Router, private fb:FormBuilder) { }

  //user:any;

  credentials!:FormGroup;
  email:string|undefined;
  password:string|undefined;
  name:string|undefined;
  lastName:string|undefined;
  dni:number|undefined;
  edad:number|undefined;
  obraSocial:string|undefined;

  loading:boolean=false;

  ngOnInit(): void {
    this.credentials = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      obraSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(24)]],
      edad: ['', [Validators.required, Validators.max(100)]]
    });
  }

  async register() {

    if(!this.credentials.invalid) {

      this.loading = true;

      const patient = {
        email: this.credentials.get('email')?.value,
        password: this.credentials.get('password')?.value,
        name: this.credentials.get('name')?.value,
        lastName: this.credentials.get('lastName')?.value,
        dni: this.credentials.get('dni')?.value,
        obraSocial: this.credentials.get('obraSocial')?.value,
        edad: this.credentials.get('edad')?.value,
        verificado: false,
        perfil: 'paciente'
      }
      
      this.auth.register(patient)
        .then(() => {
          setTimeout(() => {
            
            alert(`Te damos la bienvenida, ${patient.name}!`);

            this.loading = false;

            this.router.navigateByUrl('', {replaceUrl:true});

          }, 1000);
        })
        .catch(err => {
          alert('Ocurrió un problema');
          console.log('err', err);
          this.loading = false;
        });
    }
    else {
      alert('????');
    }
  }


}
