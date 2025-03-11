import { Component, EventEmitter, input, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Todo } from '../../../shared/models/todo.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-todo-item',
    imports: [SharedModule],
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
    todo = input.required<Todo>();
    //Behavior Subject ->
    @Output() onRemoveClick = new EventEmitter<Todo>();
    @Output() onCheckboxCheck = new EventEmitter<Todo>();

    constructor(private router: Router) {}

    handleUpdateState() {
        let updatedState: Todo = { ...this.todo(), isCompleted: !this.todo().isCompleted };
        this.onCheckboxCheck.emit(updatedState);
    }

    handleEdit() {
        this.router.navigate(['/edit', this.todo().id]);
    }
    handleViewDetails() {
        this.router.navigate(['/details', this.todo().id]);
    }
}
