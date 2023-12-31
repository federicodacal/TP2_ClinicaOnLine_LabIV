import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.css']
})
export class RegistroEspecialistaComponent implements OnInit {
  
  constructor(private auth:AuthService, private router:Router, private fb:FormBuilder, private toast:ToastService) { }
  
  //user:any;

  credentials!:FormGroup;
  email:string|undefined;
  password:string|undefined;
  name:string|undefined;
  lastName:string|undefined;
  dni:number|undefined;
  edad:number|undefined;
  especialidad:string|undefined;
  especialidadDos:string='';
  imgPerfil:string='';

  loading:boolean=false;

  ngOnInit(): void {
    this.credentials = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      especialidad: ['', [Validators.required]],
      especialidadDos: [''],
      edad: ['', [Validators.required, Validators.max(100)]],
      recaptcha: ['', Validators.required]
    });
  }

  async register() {
    if(!this.credentials.invalid && this.imgPerfil != '') {

      if(this.credentials.get('especialidad')?.value == 'otra' && this.especialidadDos == '') {
        this.toast.showWarning('Debe especificar especialidad', 'Si se seleccionó la opción "otra" se debe indicar cuál es la especialidad');
      }
      else {
        this.loading = true;

        let arrayEspecialidades:string[] = [];

      if(this.credentials.get('especialidad')?.value != 'otra') {

        arrayEspecialidades.push(this.credentials.get('especialidad')?.value);
  
        if(this.especialidadDos != '') {

          this.especialidadDos =  this.especialidadDos.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

          console.log(this.especialidadDos);

          arrayEspecialidades.push(this.especialidadDos);
        }
      }
      else {

        this.especialidadDos = this.especialidadDos.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        console.log(this.especialidadDos);

        arrayEspecialidades.push(this.especialidadDos);
      }
      
      const specialist = {
        email: this.credentials.get('email')?.value,
        password: this.credentials.get('password')?.value,
        name: this.credentials.get('name')?.value,
        lastName: this.credentials.get('lastName')?.value,
        dni: this.credentials.get('dni')?.value,
        especialidad: arrayEspecialidades,
        edad: this.credentials.get('edad')?.value,
        perfil: 'especialista',
        horarios: {
          dias: [],
          duracionTurnos: 60,
          horarioFin: "",
          horarioInicio: "",
        },
        imgPerfil: this.imgPerfil,
        habilitado: false
      }

      this.auth.register(specialist)
        .then(() => {
          setTimeout(() => {

            this.toast.showSuccess('Registro completado.', 'Por favor, revise su correo electrónico para validar su cuenta y aguarde ser aprobado.');
            
            this.loading = false;

            this.router.navigateByUrl('', {replaceUrl:true});

          }, 1000);
        })
        .catch(err => {
          this.toast.showError('Ocurrió un problema');
          console.log('err', err);
          this.loading = false;
        })
      }
    }
    else {
      this.toast.showError('Es requerido cargar una imagen de perfil', 'Revise los campos.');
    }
  }

  
  async uploadImage($event:any) {

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
          this.imgPerfil = URL;
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
