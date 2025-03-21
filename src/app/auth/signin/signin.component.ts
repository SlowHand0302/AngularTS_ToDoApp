import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { IconService } from 'carbon-components-angular';
import { provideIcons } from '@ng-icons/core';
import { LogoGithub20 } from '@carbon/icons';
import { bootstrapGoogle, bootstrapFacebook } from '@ng-icons/bootstrap-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator } from '../../shared/validators/no-whitespace.validator';
import { AuthService } from '../service/auth.service';

@Component({
    selector: 'app-signin',
    imports: [SharedModule],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss',
    providers: [provideIcons({ bootstrapGoogle, bootstrapFacebook })],
})
export class SigninComponent {
    signinForm!: FormGroup;
    constructor(protected iconService: IconService, private fb: FormBuilder, private authService: AuthService) {
        iconService.registerAll([LogoGithub20]);
        this.signinForm = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, noWhitespaceValidator()])],
        });
    }

    onSubmit() {
        let test = this.authService.signin().subscribe({
            next: (res) => {
                console.log(res);
            },
            error: (err) => console.log(err),
        });
        console.log(test);
    }

    handleResetForm() {
        this.signinForm.reset({
            email: '',
            password: '',
        });
    }
}
