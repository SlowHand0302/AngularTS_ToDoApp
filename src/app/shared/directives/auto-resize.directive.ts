import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[autoResize]',
})
export class AutoResizeDirective {
    constructor(private element: ElementRef) {}

    @HostListener('input')
    adjustHeight() {
        const textarea = this.element.nativeElement;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
}
