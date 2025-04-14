import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { IconService } from 'carbon-components-angular';
import { ChevronSort16, ChevronDown16, ChevronUp16 } from '@carbon/icons';
import { debounce, distinctUntilChanged, Subject, timer } from 'rxjs';

import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoToolsComponent } from './components/todo-tools/todo-tools.component';
import { RouteWatcherService } from '../shared/services/route-watcher.service';
import { TodoService } from './services/todo.service';
import { TodoSkeletonsComponent } from './components/todo-skeletons/todo-skeletons.component';
import { TodoSkeletonVariants } from '../shared/constants/variants.enum';
import { TaskState } from '../shared/stores/task/task.reducers';
import { Store } from '@ngrx/store';
import { Task } from '../shared/models/task.model';
import { selectLoading, selectTasks } from '../shared/stores/task/task.selectors';
import { TaskActions } from '../shared/stores/task/task.actions';

@Component({
    selector: 'app-todos',
    imports: [SharedModule, TodoModalComponent, TodoItemComponent, TodoToolsComponent, TodoSkeletonsComponent],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
    standalone: true,
})
export class TodosComponent implements OnInit {
    tasks = signal<Task[]>([]);
    isLoading = signal<boolean>(false);
    modalState = signal<boolean>(true);
    readonly skeletonVariants = TodoSkeletonVariants;
    private searchSubject = new Subject<string>();
    private store = inject(Store<{ task: TaskState }>);

    constructor(
        private router: Router,
        private routeWatcher: RouteWatcherService,
        private todoService: TodoService,
        protected iconService: IconService,
    ) {
        iconService.registerAll([ChevronDown16, ChevronSort16, ChevronUp16]);
        this.searchSubject
            .pipe(
                debounce(() => timer(300)),
                distinctUntilChanged(),
            )
            .subscribe((value) => {
                if (value) {
                    this.todoService.searchTodo(value);
                    this.todoService.APIEmulator(() => this.todoService.searchTodo(value), 'loadTodos').subscribe();
                } else {
                    this.loadingAPITest();
                }
            });
    }

    ngOnInit() {
        this.routeWatcher.currentUrl$.subscribe((url) => {
            if (url.includes('add') || url.includes('edit') || url.includes('details')) {
                this.modalState.set(true);
            } else {
                this.modalState.set(false);
            }
        });

        this.store.select(selectTasks).subscribe((tasks) => {
            this.tasks.set(tasks);
        });
        this.store.select(selectLoading).subscribe((loadings) => {
            this.isLoading.set(loadings.has('loadTasks'));
        });
        this.loadingAPITest();
    }

    onSearchBarChange(searchText: string) {
        this.searchSubject.next(searchText);
    }

    handleTriggerCloseModal() {
        this.router.navigate(['/']);
        this.routeWatcher.currentUrl$.subscribe((url) => {
            if (url === '/') {
                this.modalState.set(false);
            }
        });
    }

    loadingAPITest() {
        this.store.dispatch(TaskActions.loadTasks.request());
    }
}
