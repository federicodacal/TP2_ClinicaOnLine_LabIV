import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  user:any = {};

  view:string='mi-perfil';

  loading:boolean = false;

  constructor(private auth:AuthService, private db:DatabaseService, private router:Router) { }

  ngOnInit(): void {

    this.loading = true;
    this.auth.userData.subscribe((res:any) => {
      this.user = res;
      console.log('user mi perfil', this.user);

      this.loading = false;
    });
  }

  volver() {
    this.router.navigateByUrl('');
  }

}
