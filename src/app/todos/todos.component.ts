import { Component } from '@angular/core';
import { ButtonModule } from 'carbon-components-angular';
import { ContainedListModule } from 'carbon-components-angular';
import { IconModule } from 'carbon-components-angular';
import { SearchModule } from 'carbon-components-angular';
import { TodoItemComponent } from '../components/todo-item/todo-item.component';
import { TodoModalComponent } from '../components/todo-modal/todo-modal.component';

@Component({
    selector: 'app-todos',
    imports: [ContainedListModule, IconModule, ButtonModule, SearchModule, TodoItemComponent, TodoModalComponent],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
})
export class TodosComponent {}
