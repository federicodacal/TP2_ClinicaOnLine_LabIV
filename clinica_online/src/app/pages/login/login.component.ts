import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  icon:string='assets/img/doc.png';

  seleccionado!:number;

  user:any;
  usersAcceso:any[] = [
    { 
      email: 'julian@mail.com',
      imgPerfil: 'https://firebasestorage.googleapis.com/v0/b/clinica-online-74b81.appspot.com/o/users%2Fimg_1687810250639?alt=media&token=936f7664-6962-46b8-af2b-9d11f3e93cf5'
    },
    {
      email: 'mabel@mail.com',
      imgPerfil: 'https://firebasestorage.googleapis.com/v0/b/clinica-online-74b81.appspot.com/o/users%2Fimg_1687810070736?alt=media&token=db1cfe1e-7fbb-4ad6-9184-a46e96fff954'
    },
    {
      email: 'hector@mail.com',
      imgPerfil: 'https://firebasestorage.googleapis.com/v0/b/clinica-online-74b81.appspot.com/o/users%2Fimg_1687809184716?alt=media&token=61e135b7-3ab5-4bc4-b95f-cbc2170637b1'
    },
    {
      email: 'maria@mail.com',
      imgPerfil: 'https://firebasestorage.googleapis.com/v0/b/clinica-online-74b81.appspot.com/o/users%2Fimg_1687807022658?alt=media&token=1f2c9572-d8c9-4131-b0e7-3ba794e81c52'
    },
    {
      email: 'juancarlos@mail.com',
      imgPerfil: 'https://firebasestorage.googleapis.com/v0/b/clinica-online-74b81.appspot.com/o/users%2Fimg_1687807315955?alt=media&token=65f74a6b-4426-4c59-883d-3e1c0b6b03cf'
    },
    {
      email: 'clinica@mail.com',
      imgPerfil: 'https://firebasestorage.googleapis.com/v0/b/clinica-online-74b81.appspot.com/o/users%2Fimg_1687824922858?alt=media&token=b69a5529-4fef-4a9f-b8ed-497d733cf2b0'
    }
  ];

  credentials!:FormGroup;
  email:string|undefined;
  password:string|undefined;
  loading:boolean=false;

  subscriptionUser!:Subscription;

  constructor(private auth:AuthService, private router:Router, private fb:FormBuilder, private toast:ToastService) { }
  

  ngOnInit(): void {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    
  }

  ngOnDestroy(): void {
    if(this.subscriptionUser != null) {
      this.subscriptionUser.unsubscribe();
    }
  }

  async login() {
    if(this.email != null && this.password != null && !this.credentials.invalid) { 
      
      this.loading = true;

      if(this.user) {
        await this.auth.logout();
      }

      this.auth.login(this.credentials.value)
        .then(async (res:any) => {

          setTimeout(() => {
        
            this.subscriptionUser = this.auth.userData.subscribe(async (user:any) => {
              if(user) {
                if(user.perfil == 'especialista' && !user.habilitado) {
                  this.toast.showWarning('La cuenta no fue habilitada', 'Por favor, aguarde que su cuenta sea aprobada.');
                  await this.auth.logout();
                  //this.router.navigate(['/login']);
                }
                else if(!res?.user.emailVerified && !user.accesoRapido) {
                  this.toast.showWarning('La cuenta no está verificada', 'Revise su correo electrónico para confirmar su cuenta.');
                  await this.auth.logout();
                  //this.router.navigate(['/login']);
                }
                else {
                  this.toast.showSuccess('Sesión iniciada', `Bienvenid@, ${user.name}.`);
                  await this.router.navigate(['']);
                }
              }
            });
          
            setTimeout(() => {
              this.loading = false;
              this.subscriptionUser.unsubscribe();
            }, 500);

          }, 2000);   
        })
        .catch((err:any) => {
            this.loading = false;         
            this.toast.showError('Ocurrió un problema', 'Revise correo y/o contraseña');
            console.log('err', err);
          });
    }
    else {
      this.toast.showError('Campos incompletos o erróneos', 'Revise clave o contraseña');
    }
  }


  onClickSeleccionar(user:any, opt:number) {
    if(user != null) {
      this.seleccionado = opt;
      this.email = user.email;
      this.password = '123456';
    }
  }

}
