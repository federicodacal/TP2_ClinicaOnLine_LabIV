import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-seleccion-usuarios',
  templateUrl: './seleccion-usuarios.component.html',
  styleUrls: ['./seleccion-usuarios.component.css']
})
export class SeleccionUsuariosComponent implements OnInit, OnDestroy {

  icon:string='assets/img/doc.png';
  iconPatient:string='assets/img/patient.png';
  iconSpecialist:string='assets/img/specialist.png';

  users:any [] = [];

  view:string='seleccion-usuarios';

  loading:boolean = false;

  subscription!:Subscription;

  constructor(private db:DatabaseService) { }

  ngOnInit(): void {

    this.loading = true;

    this.subscription = this.db.getUsers().subscribe((res:any) => {
      this.users = res;
      console.log('users', this.users);

      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  habilitar(uid:string) {
    this.db.updateStatusSpecialist(uid, 'habilitar');
  }

  deshabilitar(uid:string) {
    this.db.updateStatusSpecialist(uid, 'deshabilitar');
  }

}
