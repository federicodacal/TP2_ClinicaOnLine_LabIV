import { Component, OnDestroy, OnInit } from '@angular/core';
import { PieChart, PieChartOptions, ResponsiveOptions } from 'chartist';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit, OnDestroy {

  logo:string='assets/img/icon.png';

  logs:any[] = [];
  turnos:any[] = [];

  arrayEspecialidades:any[] = [];
  arrayEspecialsitas:any[] = [];

  subscriptionTurnos!:Subscription;
  subscriptionLogs!:Subscription;

  constructor(private db:DatabaseService) { }

  ngOnInit(): void {
    this.subscriptionLogs = this.db.getLogs().subscribe((res:any) => {
      this.logs = res;
      console.log('logs', this.logs);
    });

    this.subscriptionTurnos = this.db.getTurnos().subscribe((res:any) => {
      this.turnos = res;
      console.log('turnos', this.turnos);

      this.turnos.forEach((t:any) => {
        if(!this.arrayEspecialidades.includes(t.especialidad)) {
          this.arrayEspecialidades.push(t.especialidad);
        }

        if(!this.arrayEspecialsitas.some((esp:any) => esp.uid === t.uidEspecialista)) {
          this.arrayEspecialsitas.push({uid:t.uidEspecialista, nombre:t.nombreEspecialista});
        }
      });
    });
  }

  ngOnDestroy(): void {
    if(this.subscriptionLogs != null) {
      this.subscriptionLogs.unsubscribe;
    }
    if(this.subscriptionTurnos != null) {
      this.subscriptionTurnos.unsubscribe;
    }
  }


  mostrarChartTurnosPorEspecialidad() {

    let arrayEsp:string[] = [];
    let arrayCont:number[] = [];

    this.arrayEspecialidades.forEach(r => {
      arrayEsp.push(r);
      arrayCont.push(0);
    });

    for(let i=0; this.turnos.length > i; i++) {

      for(let j=0; arrayEsp.length > j; j++) {
        if(this.turnos[i].especialidad == arrayEsp[j]) {
          arrayCont[j]++;
        }
      }
    }

    const data = {
      labels: arrayEsp,
      series: arrayCont
    };

    const options: PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0]
    };

    const responsiveOptions: ResponsiveOptions<PieChartOptions> = [
      [
        'screen and (min-width: 640px)',
        {
          chartPadding: 30,
          labelOffset: 100,
          labelDirection: 'explode',
          labelInterpolationFnc: value => value
        }
      ],
      [
        'screen and (min-width: 1024px)',
        {
          labelOffset: 80,
          chartPadding: 20
        }
      ]
    ];

    new PieChart('#chart', data, options, responsiveOptions);
  }

  mostrarChartTurnosPorDia() {

    let contLunes=0;
    let contMartes=0;
    let contMiercoles=0;
    let contJueves=0;
    let contViernes=0;
    let contSabado=0;

    for(let i=0; this.turnos.length > i; i++) {

      let array = this.turnos[i].dia.split('/');

      let day = array[0];
      let month = array[1];
      let year = parseInt(`20${array[2]}`);

      //console.log(day + month + year);
      
      let diaDeLaSemana = new Date(year,month+1,day).getDay();

      //console.log(diaDeLaSemana);

      switch(diaDeLaSemana) {
        case 0:
          contLunes++;
          break;
        case 1:
          contMartes++;
          break;
        case 2:
          contMiercoles++;
          break;
        case 3:
          contJueves++;
          break;
        case 4:
          contViernes++;
          break;
        case 5:
          contSabado++;
          break;
      }
    }

    const data = {
      labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      series: [contLunes, contMartes, contMiercoles, contJueves, contViernes, contSabado]
    };

    const options: PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0]
    };

    const responsiveOptions: ResponsiveOptions<PieChartOptions> = [
      [
        'screen and (min-width: 640px)',
        {
          chartPadding: 30,
          labelOffset: 100,
          labelDirection: 'explode',
          labelInterpolationFnc: value => value
        }
      ],
      [
        'screen and (min-width: 1024px)',
        {
          labelOffset: 80,
          chartPadding: 20
        }
      ]
    ];

    new PieChart('#chart', data, options, responsiveOptions);
  }

  // 7 dias, 30 dias
  mostrarChartTurnosFinalizadosPorMedico() {

  }

  // 7 dias, 30 dias
  mostrarChartTurnosSolicitadosPorMedico() {

  }

  showPieChart() {
    const data = {
      labels: ['Bananas', 'Apples', 'Grapes'],
      series: [20, 15, 40]
    };

    const options: PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0]
    };

    const responsiveOptions: ResponsiveOptions<PieChartOptions> = [
      [
        'screen and (min-width: 640px)',
        {
          chartPadding: 30,
          labelOffset: 100,
          labelDirection: 'explode',
          labelInterpolationFnc: value => value
        }
      ],
      [
        'screen and (min-width: 1024px)',
        {
          labelOffset: 80,
          chartPadding: 20
        }
      ]
    ];

    new PieChart('#chart', data, options, responsiveOptions);
  }

  volver() {

  }
  
  
}
