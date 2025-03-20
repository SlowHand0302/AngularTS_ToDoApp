import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { IconService } from 'carbon-components-angular';
import { provideIcons } from '@ng-icons/core';
import { LogoGithub20 } from '@carbon/icons';
import { bootstrapGoogle, bootstrapFacebook } from '@ng-icons/bootstrap-icons';

@Component({
    selector: 'app-signin',
    imports: [SharedModule],
    templateUrl: './signin.component.html',
    styleUrl: './signin.component.scss',
    providers: [provideIcons({ bootstrapGoogle, bootstrapFacebook })],
})
export class SigninComponent {
    constructor(protected iconService: IconService) {
        iconService.registerAll([LogoGithub20]);
    }
}
