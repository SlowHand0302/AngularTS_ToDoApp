import { Component, inject, input } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';
import { Task } from '../../../shared/models/task.model';
import { Store } from '@ngrx/store';
import { TaskState } from '../../../shared/stores/task/task.reducers';
import { TaskActions } from '../../../shared/stores/task/task.actions';

@Component({
    selector: 'app-todo-item',
    imports: [SharedModule],
    templateUrl: './todo-item.component.html',
    styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
    task = input.required<Task>();
    private store = inject(Store<{ task: TaskState }>);
    constructor(private router: Router) {}

    handleUpdateState() {}

    handleEdit() {
        this.router.navigate(['/edit', this.task()._id]);
    }

    handleViewDetails() {
        this.router.navigate(['/details', this.task()._id]);
    }

    handleRemove() {
        this.store.dispatch(TaskActions.deleteTask.request({ id: { _id: this.task()._id } }));
    }
}
