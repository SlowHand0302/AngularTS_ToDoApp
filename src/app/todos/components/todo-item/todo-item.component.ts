import { Component, EventEmitter, input, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Todo } from '../../../shared/models/todo.model';

@Component({
    selector: 'app-todo-item',
    imports: [SharedModule],
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
    todo = input.required<Todo>();
    @Output() onViewClick = new EventEmitter<Todo>();
    @Output() onEditClick = new EventEmitter<Todo>();
    @Output() onRemoveClick = new EventEmitter<Todo>();
    @Output() onCheckboxCheck = new EventEmitter<Todo>();
}
