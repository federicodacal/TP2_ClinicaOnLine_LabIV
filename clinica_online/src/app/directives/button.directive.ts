import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appButton]'
})
export class ButtonDirective implements OnInit {

  @Input('appButton') tipo:string = '';

  constructor(private el:ElementRef) { }

  ngOnInit(): void {
    this.el.nativeElement.classList.add('btn');

    if(this.tipo == 'pdf') {
      this.el.nativeElement.classList.add('btn-danger');
    }
    else if(this.tipo == 'excel') {
      this.el.nativeElement.classList.add('btn-success');
    }
  }



}
