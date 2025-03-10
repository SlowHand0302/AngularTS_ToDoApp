import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function isoDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return { required: true }; // ✅ Required Check

        const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

        return isoPattern.test(control.value) ? null : { invalidISODate: true }; // ❌ Invalid Format
    };
}
