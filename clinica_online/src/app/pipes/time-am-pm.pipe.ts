import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAmPm'
})
export class TimeAmPmPipe implements PipeTransform {

  transform(value:any, ...args: unknown[]): unknown {
    let time:string='';

    //console.log('desde pipe', value);
    
    if(value) {
      let array = value.toString().split(':');

      if(parseInt(array[0]) < 12) {
        time = `${array[0]}:${array[1]}am`;
      }
      else {
        switch(array[0]) {
          case '12':
            time = '12' + ':' + array[1] + 'pm';
            break;
          case '13':
            time = '01' + ':' + array[1] + 'pm';
            break;
          case '14':
            time = '02' + ':' + array[1] + 'pm';
            break;
          case '15':
            time = '03' + ':' + array[1] + 'pm';
            break;
          case '16':
            time = '04' + ':' +array[1] + 'pm';
            break;
          case '17':
            time = '05' + ':' +array[1] + 'pm';
            break;
          case '18':
            time = '06' + ':' + array[1] + 'pm';
            break; 
          case '19':
            time = '07' + ':' + array[1] + 'pm';
            break;
          case '20':
            time = '08' + ':' + array[1] + 'pm';
            break;
          case '21':
            time = '09' + ':' + array[1] + 'pm';
            break;
          case '22':
            time = '10' + ':' + array[1] + 'pm';
            break;
          case '23': 
            time = '11' + ':' + array[1] + 'pm';
            break;
          case '24':
            time = '12' + ':' + array[1] + 'pm';
            break;
        }
      }
    }
    return time;
  }

}
