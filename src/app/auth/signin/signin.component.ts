import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { IconService } from 'carbon-components-angular';
import { provideIcons } from '@ng-icons/core';
import { LogoGithub20 } from '@carbon/icons';
import { bootstrapGoogle, bootstrapFacebook } from '@ng-icons/bootstrap-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator } from '../../shared/validators/no-whitespace.validator';
import { AuthService } from '../service/auth.service';
import { NotificationVariants, NotificationService } from '../../shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signin',
    imports: [SharedModule],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss',
    providers: [provideIcons({ bootstrapGoogle, bootstrapFacebook })],
    standalone: true,
})
export class SigninComponent {
    signinForm!: FormGroup;
    constructor(
        protected iconService: IconService,
        private fb: FormBuilder,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router,
    ) {
        iconService.registerAll([LogoGithub20]);
        this.signinForm = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, noWhitespaceValidator()])],
        });
    }

    onSubmit() {
        this.authService.signin(this.signinForm.value).subscribe({
            next: (res) => {
                this.notificationService.showNotification(NotificationVariants.NOTIFICATION, {
                    type: 'success',
                    title: 'Login Success',
                });
                this.router.navigate(['/']);
            },
            error: (err) => {
                const error = err.error;
                this.notificationService.showNotification(NotificationVariants.NOTIFICATION, {
                    type: 'error',
                    title: error.msg,
                });
            },
        });
    }

    handleResetForm() {
        this.signinForm.reset({
            email: '',
            password: '',
        });
    }
}
