import { Component, OnInit, signal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { IconService } from 'carbon-components-angular';
import { ChevronSort16, ChevronDown16, ChevronUp16 } from '@carbon/icons';
import { debounce, distinctUntilChanged, Subject, timer } from 'rxjs';

import { Todo } from '../shared/models/todo.model';
import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoToolsComponent } from './components/todo-tools/todo-tools.component';
import { RouteWatcherService } from '../shared/services/route-watcher.service';
import { TodoService } from './services/todo.service';
import { TodoSkeletonsComponent } from './components/todo-skeletons/todo-skeletons.component';
import { TodoSkeletonVariants } from '../shared/constants/varianst.enum';
import { AuthService } from '../auth/service/auth.service';

@Component({
    selector: 'app-todos',
    imports: [
        SharedModule,
        TodoModalComponent,
        TodoItemComponent,
        RouterLink,
        RouterOutlet,
        TodoToolsComponent,
        TodoSkeletonsComponent,
    ],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
    standalone: true,
})
export class TodosComponent implements OnInit{
    todos = signal<Todo[]>([]);
    isLoading = signal<boolean>(false);
    modalState = signal<boolean>(true);
    readonly skeletonVariants = TodoSkeletonVariants;
    private searchSubject = new Subject<string>();

    constructor(
        private router: Router,
        private routeWatcher: RouteWatcherService,
        private todoService: TodoService,
        protected iconService: IconService,
        private authService: AuthService,
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
                    this.loadingTodos();
                }
            });
    }

    ngOnInit() {
        this.routeWatcher.currentUrl$.subscribe((url) => {
            // console.log('URL changed:', url); // Logs every URL change
            if (url.includes('add') || url.includes('edit') || url.includes('details')) {
                this.modalState.set(true);
            } else {
                this.modalState.set(false);
            }
        });
        this.todoService.todosSubject$.subscribe((todoList) => {
            this.todos.set([...todoList]);
        });
        this.todoService.isLoading('loadTodos').subscribe((result) => {
            this.isLoading.set(result);
        });
        this.loadingTodos();
        this.loadingAPITest()
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

    loadingTodos() {
        this.todoService.APIEmulator(() => this.todoService.resetTodo(), 'loadTodos').subscribe();
    }

    loadingAPITest() {
        this.authService.testReq().subscribe({
            next: (res) => console.log(res),
            error: (err) => console.log(err),
        });
    }
}
