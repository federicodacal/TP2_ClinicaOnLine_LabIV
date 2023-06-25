import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
//import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user:any = {};
  userLogged:boolean = false;
  logButton!:string;
  loading:boolean = false;

  constructor(private router:Router, private auth:AuthService) { }

  ngOnInit(): void {
    this.loading = true;
    this.auth.userData.subscribe((res:any) => {
      if(res) {
        this.logButton = 'Log Out';
        this.user = res;
        this.userLogged = true;
        this.loading = false;
      }
      else {
        this.logButton = 'Log In';
        this.user = null;
        this.loading = false;
      }

    });
  }

  redirectToLogin() {
    this.router.navigateByUrl('/login');
  }

  logout() {
    
   // this.spinner.show();
    
    setTimeout(() => {
      this.userLogged = false;
      this.user = null;
      this.logButton = 'Log In'
      this.auth.logout();

      //this.spinner.hide();

      Swal.fire(
        'Gracias por tu visita',
        'La sesión fue cerrada',
        'info'
      );

      this.router.navigateByUrl('/login');
    }, 1000);
  }

}
