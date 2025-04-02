import { AutoResizeDirective } from './auto-resize.directive';
import { ElementRef } from '@angular/core';
describe('AutoResizeDirective', () => {
    let directive: AutoResizeDirective;
    let elementRefMock: Pick<ElementRef, 'nativeElement'>;
    beforeEach(async () => {
        elementRefMock = {
            nativeElement: document.createElement('textarea'),
        };
        directive = new AutoResizeDirective(elementRefMock);
    });

    it('should create an instance', () => {
        expect(elementRefMock).toBeTruthy();
    });

    it('should adjust the height of the textarea on input', () => {
        const textarea = elementRefMock.nativeElement as HTMLTextAreaElement;
        textarea.style.height = '50px';
        Object.defineProperty(textarea, 'scrollHeight', { value: 100 });
        directive.adjustHeight();
        expect(textarea.style.height).toBe('100px');
    });
});
