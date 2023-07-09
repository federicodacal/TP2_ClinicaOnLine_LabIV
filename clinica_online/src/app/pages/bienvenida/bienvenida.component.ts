import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent {

  icon:string='assets/img/doc.png';
  logo:string='assets/img/icon.png';

  constructor(private router:Router) { }

  onClickRegister() {
    this.router.navigateByUrl('/registro');
  }

  onClickLogin() {
    this.router.navigateByUrl('/login');
  }
  
}
