import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';

import { Task } from '../../../shared/models/task.model';
import { SharedModule } from '../../../shared/shared.module';
import { TaskState } from '../../../shared/stores/task/task.reducers';
import { TaskActions } from '../../../shared/stores/task/task.actions';
import { TodoSkeletonVariants } from '../../../shared/constants/variants.enum';
import { TodoSkeletonsComponent } from '../todo-skeletons/todo-skeletons.component';
import { selectChosenTask, selectLoading } from '../../../shared/stores/task/task.selectors';

@Component({
    selector: 'app-todo-detail',
    imports: [SharedModule, TodoSkeletonsComponent],
    templateUrl: './todo-detail.component.html',
    styleUrl: './todo-detail.component.scss',
})
export class TodoDetailComponent implements OnInit {
    private readonly aRoute = inject(ActivatedRoute);
    private store = inject(Store<{ task: TaskState }>);
    readonly skeletonVariants = TodoSkeletonVariants;
    isLoading = signal<boolean>(false);
    task: Task | null = null;

    ngOnInit() {
        this.aRoute.paramMap.subscribe((params) => {
            const id = params.get('id'); // Get the 'id' from the URL
            if (id) {
                this.fetchTodoById(id);
            }
        });
        this.store.select(selectLoading).subscribe((loadings) => {
            this.isLoading.set(loadings.has('loadTaskByID'));
        });
        this.store.select(selectChosenTask).subscribe((task) => {
            this.task = task;
        });
    }

    fetchTodoById(_id: string) {
        this.store.dispatch(TaskActions.loadTaskByID.request({ taskID: { _id } }));
    }
}
