import { AbstractControl } from '@angular/forms';
import { noWhitespaceValidator } from './no-whitespace.validator';

describe('noWhitespaceValidator', () => {
    it('should return null if value is not whitespace', () => {
        const control = { value: 'Hello' } as AbstractControl;
        const result = noWhitespaceValidator()(control);
        expect(result).toBeNull(); // No error, as the value is valid
    });
    it('should return an error if value is only whitespace', () => {
        const control = { value: '   ' } as AbstractControl;
        const result = noWhitespaceValidator()(control);
        expect(result).toEqual({ whitespace: 'value is only whitespace' });
    });

    it('should return an error if value is an empty string', () => {
        const control = { value: '' } as AbstractControl;
        const result = noWhitespaceValidator()(control);
        expect(result).toEqual({ whitespace: 'value is only whitespace' });
    });
});
