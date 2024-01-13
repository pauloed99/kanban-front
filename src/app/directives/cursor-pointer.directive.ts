import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[cursorPointer]',
  standalone: true,
})
export class CursorPointerDirective { 
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.cursor = 'pointer';
  }
}
