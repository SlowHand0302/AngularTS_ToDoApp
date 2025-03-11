import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'carbon-components-angular';
import { InputModule } from 'carbon-components-angular';
import { ContainedListModule } from 'carbon-components-angular';
import { IconModule } from 'carbon-components-angular';
import { SearchModule } from 'carbon-components-angular';
import { ModalModule } from 'carbon-components-angular';
import { DatePickerModule } from 'carbon-components-angular';
import { ToggleModule } from 'carbon-components-angular';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'carbon-components-angular';
import { TooltipModule } from 'carbon-components-angular';
import { DialogModule } from 'carbon-components-angular';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
@NgModule({
    declarations: [],
    imports: [
        CommonModule, // Required for ngIf, ngFor, etc.
        ContainedListModule,
        IconModule,
        SearchModule,
        ModalModule,
        DatePickerModule,
        ToggleModule,
        FormsModule,
        ButtonModule,
        InputModule,
        CheckboxModule,
        TooltipModule,
        DialogModule,
        // Route components & services
        RouterLink,
        RouterOutlet,
    ],
    exports: [
        CommonModule, // Required for ngIf, ngFor, etc.
        ContainedListModule,
        IconModule,
        SearchModule,
        ModalModule,
        DatePickerModule,
        ToggleModule,
        FormsModule,
        ButtonModule,
        InputModule,
        CheckboxModule,
        TooltipModule,
        DialogModule,
        // Route components & services
        RouterLink,
        RouterOutlet,
    ],
})
export class SharedModule {}
