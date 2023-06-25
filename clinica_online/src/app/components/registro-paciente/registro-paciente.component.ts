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

  credentials!:FormGroup;
  user:any;
  email:string|undefined;
  password:string|undefined;
  name:string|undefined;
  lastName:string|undefined;
  dni:number|undefined;
  edad:number|undefined;
  obraSocial:string|undefined;

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
    if(this.credentials.get('password')?.value === this.credentials.get('confirmPassword')?.value) {

      //this.spinner.show();

      const name = this.credentials.get('name')?.value;

      this.auth.register(this.credentials.value)
        .then(() => {
          setTimeout(() => {
            //this.spinner.hide();
            this.router.navigateByUrl('', {replaceUrl:true});

            alert(`Te damos la bienvenida, ${name}!`);
          }, 1000);
        })
        .catch(err => {
          alert('Ocurrió un problema');
          console.log('err', err);
          //this.spinner.hide();
        });
    }
    else {
      alert('Debe coincidir la clave con la confirmación');
    }
  }
}
