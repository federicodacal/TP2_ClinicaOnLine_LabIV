import { Component, OnInit } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css']
})
export class RegistroPacienteComponent implements OnInit {

  constructor(private auth:AuthService, private router:Router, private fb:FormBuilder, private toast:ToastService) { }

  //user:any;

  credentials!:FormGroup;
  email:string|undefined;
  password:string|undefined;
  name:string|undefined;
  lastName:string|undefined;
  dni:number|undefined;
  edad:number|undefined;
  obraSocial:string|undefined;
  imgPerfil:string='';
  imgSecundaria:string='';

  loading:boolean=false;

  ngOnInit(): void {
    this.credentials = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      obraSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(24)]],
      edad: ['', [Validators.required, Validators.max(100)]],
      recaptcha: ['', Validators.required]
    });
  }

  async register() {

    if(!this.credentials.invalid && (this.imgPerfil != '' && this.imgSecundaria != '')) {

      this.loading = true;

      const patient = {
        email: this.credentials.get('email')?.value,
        password: this.credentials.get('password')?.value,
        name: this.credentials.get('name')?.value,
        lastName: this.credentials.get('lastName')?.value,
        dni: this.credentials.get('dni')?.value,
        obraSocial: this.credentials.get('obraSocial')?.value,
        edad: this.credentials.get('edad')?.value,
        imgPerfil: this.imgPerfil,
        imgSecundaria: this.imgSecundaria,
        verificado: false,
        perfil: 'paciente'
      }
      
      this.auth.register(patient)
        .then(() => {
          setTimeout(() => {
            
            this.toast.showSuccess('Registro completado.', 'Por favor, revise su correo electrónico para validar su cuenta.');

            this.loading = false;

            this.router.navigateByUrl('', {replaceUrl:true});

          }, 1000);
        })
        .catch(err => {
          this.toast.showError('Ocurrió un problema');
          console.log('err', err);
          this.loading = false;
        });
    }
    else {
      this.toast.showError('Es requerido cargar dos imagenes', 'Revise los campos.');
    }
  }

  async uploadImage($event:any, nro:number) {

    try {
      this.loading = true;

      const file = $event.target.files[0];
      const path = 'users/img_' + Date.now();
  
      const storage = getStorage();
  
      //const usersRef = ref(storage, path);
      //const userImgRef = ref(storage, `users_images/${path}`);
  
      const storageRef = ref(storage, path);
      uploadBytes(storageRef, file).then(async (snapshot) => {
        this.loading = false;
        console.log('img subida ok!');
        await getDownloadURL(ref(storage, path)).then((URL:any) => {
          if(nro === 1) {
            this.imgPerfil = URL;
          }
          else if(nro === 2) {
            this.imgSecundaria = URL;
          }
        });  
      })
      .catch(err => {
        this.loading = false;
        console.log('err img', err);
      });
    }
    catch(err) {
      this.loading = false;
      console.log('err img', err);
    }
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved response token: ${captchaResponse}`);
  }

}
