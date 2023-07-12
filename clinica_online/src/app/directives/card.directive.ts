import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCard]'
})
export class CardDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.addHoverStyles();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.removeHoverStyles();
  }

  private addHoverStyles() {
    const cardElement = this.elementRef.nativeElement;
    this.renderer.addClass(cardElement, 'card-hover');
  }

  private removeHoverStyles() {
    const cardElement = this.elementRef.nativeElement;
    this.renderer.removeClass(cardElement, 'card-hover');
  }
}
