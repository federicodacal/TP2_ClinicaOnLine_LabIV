import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
//import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Input() selectedOpt:string='';
  
  user:any = {};
  userLogged:boolean = false;
  acceso:string = '';
  loading:boolean = false;

  subscription!:Subscription;

  constructor(private router:Router, private auth:AuthService, private toast:ToastService) { }

  
  ngOnInit(): void {
    this.loading = true;
    this.subscription = this.auth.userData.subscribe((res:any) => {
      if(res) {
          this.user = res;
          this.userLogged = true;
          this.loading = false;
          this.acceso = this.user.name;
      }
      else {
        this.user = null;
        this.loading = false;
        this.acceso = 'Acceso';
      }

    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  redirectToLogin() {
    this.router.navigateByUrl('/login');
  }

  logout() {
    
    this.loading = true;
    
    setTimeout(() => {
      const name = this.user.name;
      this.userLogged = false;
      this.user = null;
      this.acceso = 'Acceso';
      this.auth.logout();

      this.loading = false;

      this.toast.showSuccess('La sesión fue cerrada', `Hasta luego, ${name}.`);

      this.router.navigateByUrl('/login');
    }, 1000);
  }

  onClickSidebar(opt:string) {
    if(opt == 'home') {
      this.selectedOpt = 'home';
      this.router.navigateByUrl('');
    }
    else if(opt == 'seleccion') {
      this.selectedOpt = 'seleccion';
    }
  }

}
