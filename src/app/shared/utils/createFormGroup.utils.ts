import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

// Generic function to create a FormGroup based on an interface
export default function createFormGroup<T extends object>(
    fb: FormBuilder,
    model: T,
): FormGroup<{ [K in keyof T]: FormControl<T[K]> }> {
    const controls = Object.keys(model).reduce((acc, key) => {
        acc[key as keyof T] = new FormControl(model[key as keyof T]) as FormControl<T[keyof T]>;
        return acc;
    }, {} as { [K in keyof T]: FormControl<T[K]> });

    return new FormGroup(controls);
}
