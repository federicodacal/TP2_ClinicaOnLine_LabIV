import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  icon:string='assets/img/doc.png';

  user:any;

  credentials!:FormGroup;
  email:string|undefined;
  password:string|undefined;
  loading:boolean=false;

  subscription!:Subscription;

  constructor(private auth:AuthService, private router:Router, private fb:FormBuilder, private toast:ToastService) { }
  

  ngOnInit(): void {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
  }

  ngOnDestroy(): void {
    if(this.subscription != null) {
      this.subscription.unsubscribe();
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
        
            this.subscription = this.auth.userData.subscribe(async (user:any) => {
              if(user) {
                if(user.perfil == 'especialista' && !user.habilitado) {
                  this.toast.showWarning('La cuenta no fue habilitada', 'Aguarde que se aprueba su cuente.');
                  await this.auth.logout();
                  //this.router.navigate(['/login']);
                }
                else if(!res?.user.emailVerified) {
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
              this.subscription.unsubscribe();
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


  

}
