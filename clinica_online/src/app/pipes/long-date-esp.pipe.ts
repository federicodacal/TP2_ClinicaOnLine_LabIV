import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'longDateEsp'
})
export class LongDateEspPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    let date:string='';

    //console.log('desde pipe', value);
    
    if(value) {
      let array = value.toString().split(' ');

      let dayNum = array[2];
      let dayName = '';
      let monthName = '';
      let year = array[3];

      switch(array[0]) {
        case 'Mon':
          dayName = 'Lunes';
          break;
        case 'Tue':
          dayName = 'Martes';
          break;
        case 'Wed':
          dayName = 'Miercoles';
          break;
        case 'Thu':
          dayName = 'Jueves';
          break;
        case 'Fri':
          dayName = 'Viernes';
          break;
        case 'Sat':
          dayName = 'Sabado';
          break;
        case 'Sun':
          dayName = 'Domingo';
          break;
      }

      switch(array[1]) {
        case 'Jan':
          monthName = 'Enero';
          break;
        case 'Feb':
          monthName = 'Febrero';
          break;
        case 'Mar':
          monthName = 'Marzo';
          break;
        case 'Apr':
          monthName = 'Abril';
          break;
        case 'May':
          monthName = 'Mayo';
          break;
        case 'Jun':
          monthName = 'Junio';
          break;
        case 'Jul':
          monthName = 'Julio';
          break;
        case 'Aug':
          monthName = 'Agosto';
          break;
        case 'Sep':
          monthName = 'Septiembre';
          break;
        case 'Oct':
          monthName = 'Octubre';
          break;
        case 'Nov':
          monthName = 'Noviembre';
          break;
        case 'Dec':
          monthName = 'Diciembre';
          break;
      }

      date = `${dayName} ${dayNum} de ${monthName} del ${year}`;

    }
    return date;
  }

}
