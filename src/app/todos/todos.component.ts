import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { IconService } from 'carbon-components-angular';
import { ChevronSort16, ChevronDown16, ChevronUp16, UserAvatar20 } from '@carbon/icons';
import { debounce, distinctUntilChanged, Subject, timer } from 'rxjs';

import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoToolsComponent } from './components/todo-tools/todo-tools.component';
import { RouteWatcherService } from '../shared/services/route-watcher.service';
import { TodoSkeletonsComponent } from './components/todo-skeletons/todo-skeletons.component';
import { TodoSkeletonVariants } from '../shared/constants/variants.enum';
import { TaskState } from '../shared/stores/task/task.reducers';
import { Store } from '@ngrx/store';
import { Task } from '../shared/models/task.model';
import { selectLoading, selectSearchQuery, selectTasks } from '../shared/stores/task/task.selectors';
import { TaskActions } from '../shared/stores/task/task.actions';
import { AuthService } from '../shared/API/services/auth.service';
import { NotificationService, NotificationVariants } from '../shared/services/notification.service';
@Component({
    selector: 'app-todos',
    imports: [SharedModule, TodoModalComponent, TodoItemComponent, TodoToolsComponent, TodoSkeletonsComponent],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
    standalone: true,
})
export class TodosComponent implements OnInit {
    private store = inject(Store<{ task: TaskState }>);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private searchSubject = new Subject<string>();
    readonly skeletonVariants = TodoSkeletonVariants;
    tasks = signal<Task[]>([]);
    isLoading = signal<boolean>(false);
    modalState = signal<boolean>(true);

    constructor(private router: Router, private routeWatcher: RouteWatcherService, protected iconService: IconService) {
        iconService.registerAll([ChevronDown16, ChevronSort16, ChevronUp16, UserAvatar20]);
        this.searchSubject
            .pipe(
                debounce(() => timer(300)),
                distinctUntilChanged(),
            )
            .subscribe((value) => {
                if (value) {
                    this.store.dispatch(TaskActions.searchTask.set({ option: { title: value } }));
                } else {
                    this.store.dispatch(TaskActions.searchTask.reset());
                    this.loadTasks();
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
        this.store.select(selectSearchQuery).subscribe((search) => {
            console.log(search);
        });
        this.loadTasks();
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

    loadTasks() {
        this.store.dispatch(TaskActions.loadTasks.request());
    }

    handleSignOut() {
        this.authService.signOut().subscribe({
            next: (value) => {
                console.log(value)
                this.notificationService.showNotification(NotificationVariants.NOTIFICATION, {
                    type: 'success',
                    title: 'Logout Success',
                });
                this.router.navigate(['/login']);
            },
        });
    }
}
