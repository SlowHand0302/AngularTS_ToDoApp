import { Component } from '@angular/core';
import { CheckboxModule } from 'carbon-components-angular/checkbox';
import { ContainedListModule } from 'carbon-components-angular';
import { DialogModule } from 'carbon-components-angular';
import { TooltipModule } from 'carbon-components-angular';

@Component({
    selector: 'app-todo-item',
    imports: [CheckboxModule, ContainedListModule, DialogModule, TooltipModule],
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {}
