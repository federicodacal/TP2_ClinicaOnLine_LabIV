import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform {

  transform(value:any, ...args: unknown[]): unknown {

    let date:string='';

    //console.log('desde pipe', value);
    
    if(value) {
      let array = value.toString().split(' ');

      date = `${array[2]}/`;

      switch(array[1]) {
        case 'Jan':
          date += '01';
          break;
        case 'Feb':
          date += '02';
          break;
        case 'Mar':
          date += '03';
          break;
        case 'Apr':
          date += '04';
          break;
        case 'May':
          date += '05';
          break;
        case 'Jun':
          date += '06';
          break;
        case 'Jul':
          date += '07';
          break;
        case 'Aug':
          date += '08';
          break;
        case 'Sep':
          date += '09';
          break;
        case 'Oct':
          date += '10';
          break;
        case 'Nov':
          date += '11';
          break;
        case 'Dec':
          date += '12';
          break;
      }
    }
    return date;
  }

}
