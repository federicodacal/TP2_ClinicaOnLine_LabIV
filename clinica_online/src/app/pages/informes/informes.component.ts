import { Component, OnDestroy, OnInit } from '@angular/core';
import { PieChart, BarChart, PieChartOptions, BarChartOptions, ResponsiveOptions } from 'chartist';
import { Subscription } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ToastService } from 'src/app/services/toast.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
//import 'svg2pdf.js';
//import { svg2pdf } from 'svg2pdf.js';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit, OnDestroy {

  logo:string='assets/img/icon.png';

  dias:Date[] = [];
  logs:any[] = [];
  turnos:any[] = [];

  arrayEspecialidades:any[] = [];
  arrayEspecialsitas:any[] = [];

  subscriptionTurnos!:Subscription;
  subscriptionLogs!:Subscription;

  constructor(private db:DatabaseService) { }

  ngOnInit(): void {
    this.subscriptionLogs = this.db.getLogs().subscribe((res:any) => {
      this.logs = res.sort((l1:any,l2:any) => {
        return l2.date.seconds - l1.date.seconds;
      });
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

    this.dias = this.getDatesBetween();
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

    new PieChart('#chart_especialidades', data, options, responsiveOptions);

    this.renderChart(data.labels, data.series, 'pie', 'piechart');
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

    /*
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
    
    new PieChart('#chart_dias', data, options, responsiveOptions);
    */
    
    const data = {
      labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
      series: [contLunes, contMartes, contMiercoles, contJueves, contViernes, contSabado]
    };
    
    const options: BarChartOptions = {
      high: 10,
      low: 0,
      distributeSeries: true
    };
    
    new BarChart('#chart_dias', data, options);
    
    this.renderChart(data.labels, data.series, 'bar', 'barchart');
  }

  // 7 dias
  mostrarChartTurnosFinalizadosPorMedico() {

    let arrayEsp:string[] = [];
    let arrayCont:number[] = [];

    this.arrayEspecialsitas.forEach(r => {
      arrayEsp.push(r.nombre);
      arrayCont.push(0);
    });

    let turnosFinalizados = this.turnos.filter(t => t.estado == 'finalizado');

    for(let i=0; turnosFinalizados.length > i; i++) {

      let array = turnosFinalizados[i].dia.split('/');
      let day = array[0];
      let month = parseInt(array[1])-1;
      let year = parseInt(`20${array[2]}`);

      let dia = new Date(year,month,day);

      for(let j=0; arrayEsp.length > j; j++) {
        if(dia < this.dias[this.dias.length-1] && dia > this.dias[0]) {
          if(turnosFinalizados[i].nombreEspecialista == arrayEsp[j]) {
            arrayCont[j]++;
            console.log(turnosFinalizados[i].nombreEspecialista);
            console.log(dia);
          }
        }
      }
    }

    const data = {
      labels: arrayEsp,
      series: arrayCont
    };

    const options: PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0],
      donut: true
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

    new PieChart('#chart_turnos_finalizados', data, options, responsiveOptions);

    this.renderChart(data.labels, data.series, 'doughnut', 'dochart');
    /*
    this.turnos.forEach(t => {

      let array = t.dia.split('/');
      let day = array[0];
      let month = parseInt(array[1])-1;
      let year = parseInt(`20${array[2]}`);

      //console.log(day + month + year);
      //console.log('t.dia', t.dia);
      //console.log('moth', month);
      //console.log('moth+1', parseInt(month)+1);
      
      let dia = new Date(year,month,day);

      //console.log('dia turno', dia);
      //console.log('this.dias length-1', this.dias[this.dias.length-1]);
      //console.log('this.dias 0', this.dias[0]);
      //console.log('****************************************');
      //console.log(dia < this.dias[length-1]);
      //console.log(dia > this.dias[0]);

      this.arrayEspecialsitas.forEach(esp => {
       if(dia < this.dias[this.dias.length-1] && dia > this.dias[0]) {
        if(t.nombreEspecialista == esp.nombre) {
          console.log(esp.nombre);
          console.log(dia);
        }
       } 
      });
    });
    */
  }

  // 7 dias
  mostrarChartTurnosSolicitadosPorMedico() {
    let arrayEsp:string[] = [];
    let arrayCont:number[] = [];

    this.arrayEspecialsitas.forEach(r => {
      arrayEsp.push(r.nombre);
      arrayCont.push(0);
    });

    for(let i=0; this.turnos.length > i; i++) {

      let array = this.turnos[i].dia.split('/');
      let day = array[0];
      let month = parseInt(array[1])-1;
      let year = parseInt(`20${array[2]}`);

      let dia = new Date(year,month,day);

      for(let j=0; arrayEsp.length > j; j++) {
        if(dia < this.dias[this.dias.length-1] && dia > this.dias[0]) {
          if(this.turnos[i].nombreEspecialista == arrayEsp[j]) {
            arrayCont[j]++;
            console.log(this.turnos[i].nombreEspecialista);
            console.log(dia);
          }
        }
      }
    }

    const data = {
      labels: arrayEsp,
      series: arrayCont
    };

    const options: PieChartOptions = {
      labelInterpolationFnc: value => String(value)[0],
      donut: true
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

    new PieChart('#chart_turnos_solicitados', data, options, responsiveOptions);

    this.renderChart(data.labels, data.series, 'doughnut', 'dochart2');
  }

  // 7 dias atrás
  getDatesBetween() {
    let dates = [];
    let currentDate:Date = new Date(Date.now());
    //let today:any = new Date(currentDate).toDateString();
    let startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    
    //startDate.setDate(currentDate.getDate() - 15);

    console.log('current', currentDate);
    console.log('start', startDate);

    while (startDate <= currentDate) {
      dates.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    console.log(dates);
    return dates;
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_excel' + EXCEL_EXTENSION
    );
  }

  crearExcelLogs() {
    this.exportAsExcelFile(this.logs, 'logs');
  }

  /*
  crearPDF() {
    const DATA = document.getElementById('turnosPorDia');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`turnosPorDia.pdf`);
      });
  } */
  
  newPdfTurnosPorDia() {
    const canvas = document.getElementById('barchart');

    if(canvas != null) {
      //@ts-ignore
      const canvasImage = canvas.toDataURL('image/jpeg, 1.0');

      let pdf = new jsPDF();

      pdf.addImage(canvasImage, 'JPEG', 12,12,130,130);

      pdf.save(`turnosPorDia.pdf`);
    }
  }

  newPdfTurnosPorEspecialidad() {
    const canvas = document.getElementById('piechart');

    if(canvas != null) {
      //@ts-ignore
      const canvasImage = canvas.toDataURL('image/jpeg, 1.0');

      let pdf = new jsPDF();

      pdf.addImage(canvasImage, 'JPEG', 12,12,130,130);

      pdf.save(`turnosPorEspecialidad.pdf`);
    }
  }

  newPdfTurnosFinalizadosPorMedico() {
    const canvas = document.getElementById('dochart');

    if(canvas != null) {
      //@ts-ignore
      const canvasImage = canvas.toDataURL('image/jpeg, 1.0');

      let pdf = new jsPDF();

      pdf.addImage(canvasImage, 'JPEG', 12,12,130,130);

      pdf.save(`turnosFinalizadosPorMedico.pdf`);
    }
  }

  newPdfTurnosSolicitadosPorMedico() {
    const canvas = document.getElementById('dochart2');

    if(canvas != null) {
      //@ts-ignore
      const canvasImage = canvas.toDataURL('image/jpeg, 1.0');

      let pdf = new jsPDF();

      pdf.addImage(canvasImage, 'JPEG', 12,12,130,130);

      pdf.save(`turnosSolicitadosPorMedico.pdf`);
    }
  }

  renderChart(labeldata:any, maindata:any, type:any, id:any) {
    const myChart = new Chart(id, {
      type: type,
      data: {
        labels: labeldata,
        datasets: [{
          label: 'Cantidad',
          data: maindata,
          backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(255, 159, 64)',
            'rgba(255, 205, 86)',
            'rgba(75, 192, 192)',
            'rgba(54, 162, 235)',
            'rgba(153, 102, 255)',
            'rgba(201, 203, 207)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
