import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'carbon-components-angular';
import { InputModule } from 'carbon-components-angular';
import { ContainedListModule } from 'carbon-components-angular';
import { IconModule } from 'carbon-components-angular';
import { SearchModule } from 'carbon-components-angular';
import { ModalModule } from 'carbon-components-angular';
import { DatePickerModule } from 'carbon-components-angular';
import { ToggleModule } from 'carbon-components-angular';
import { CheckboxModule } from 'carbon-components-angular';
import { TooltipModule } from 'carbon-components-angular';
import { DialogModule } from 'carbon-components-angular';
import { DropdownModule } from 'carbon-components-angular';
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
        DropdownModule,
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
        DropdownModule,
        // Route components & services
        RouterLink,
        RouterOutlet,
    ],
})
export class SharedModule {}
