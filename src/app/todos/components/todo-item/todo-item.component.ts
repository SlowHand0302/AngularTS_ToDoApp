import { Component, input } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Todo } from '../../../shared/models/todo.model';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { NotificationService, NotificationVariants } from '../../../shared/services/notification.service';

@Component({
    selector: 'app-todo-item',
    imports: [SharedModule],
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
    todo = input.required<Todo>();

    constructor(
        private router: Router,
        private todoService: TodoService,
        private notificationService: NotificationService,
    ) {}

    handleUpdateState() {
        const updatedState: Todo = { ...this.todo(), isCompleted: !this.todo().isCompleted };
        this.todoService.editTodo(updatedState);
    }

    handleEdit() {
        this.router.navigate(['/edit', this.todo().id]);
    }

    handleViewDetails() {
        this.router.navigate(['/details', this.todo().id]);
    }

    handleRemove() {
        this.todoService
            .APIEmulator(() => this.todoService.removeTodo(this.todo().id), 'loadTodos')
            .subscribe(() => {
                this.notificationService.showNotification(NotificationVariants.TOAST, {
                    type: 'success',
                    title: 'Remove Todo Success',
                    subtitle: ``,
                    caption: `Todo ${this.todo().title} is Removed`,
                });
            });
    }
}
