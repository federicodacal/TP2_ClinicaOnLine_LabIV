import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  icon:string='assets/img/doc.png';

  credentials!:FormGroup;
  user:any;
  email:string|undefined;
  password:string|undefined;

  constructor(private auth:AuthService, private router:Router, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.auth.userData.subscribe((res:any) => {
      if(res) {
        this.user = res;
        console.log('user', this.user);
      }
    });
  }

  async login() {
    if(this.email != null && this.password != null) { 
      //this.spinner.show();
      this.auth.login(this.credentials.value)
      .then(() => {

        setTimeout(() => {
            alert('bienvenido');
            //this.spinner.hide();
            this.router.navigate(['']);
          }, 2000);
        })
        .catch(() => {
          //this.spinner.hide();          
          alert('error');
        });
    }
    else {
      alert('faltan campos');
    }
  }


  

}
