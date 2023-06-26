import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-seleccion-usuarios',
  templateUrl: './seleccion-usuarios.component.html',
  styleUrls: ['./seleccion-usuarios.component.css']
})
export class SeleccionUsuariosComponent implements OnInit {

  icon:string='assets/img/doc.png';

  users:any [] = [];

  loading:boolean = false;

  constructor(private db:DatabaseService) { }

  ngOnInit(): void {

    this.loading = true;

    this.db.getUsers().subscribe((res:any) => {
      this.users = res;
      console.log('users', this.users);

      this.loading = false;
    });
  }

  habilitar(uid:string) {
    this.db.updateStatusSpecialist(uid, 'habilitar');
  }

  deshabilitar(uid:string) {
    this.db.updateStatusSpecialist(uid, 'deshabilitar');
  }

}
