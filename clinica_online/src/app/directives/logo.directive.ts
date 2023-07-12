import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[logo]'
})
export class LogoDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.addEffect();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.removeEffect();
  }

  private addEffect() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'filter', 'brightness(110%)');
    this.renderer.setStyle(this.elementRef.nativeElement, 'transition', 'filter 0.3s ease-in-out');
    this.renderer.addClass(this.elementRef.nativeElement, 'rotate-effect');
  }

  private removeEffect() {
    this.renderer.removeStyle(this.elementRef.nativeElement, 'filter');
    this.renderer.removeStyle(this.elementRef.nativeElement, 'transition');
    this.renderer.removeClass(this.elementRef.nativeElement, 'rotate-effect');
  }
}