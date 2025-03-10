import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let controlVal = control.value;
        if (typeof controlVal === 'number') {
            controlVal = `${controlVal}`;
        }
        let isWhitespace = (controlVal || '').trim().length === 0;
        let isValid = !isWhitespace;
        return isValid ? null : { whitespace: 'value is only whitespace' };
    };
}
