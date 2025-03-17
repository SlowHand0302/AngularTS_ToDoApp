import { Component, signal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { IconService } from 'carbon-components-angular';
import { ChevronSort16, ChevronDown16, ChevronUp16 } from '@carbon/icons';

import { Todo } from '../shared/models/todo.model';
import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoToolsComponent } from './components/todo-tools/todo-tools.component';
import { RouteWatcherService } from '../shared/services/route-watcher.service';
import { TodoService } from './services/todo.service';
import { debounce, distinctUntilChanged, Subject, timer } from 'rxjs';

@Component({
    selector: 'app-todos',
    imports: [SharedModule, TodoModalComponent, TodoItemComponent, RouterLink, RouterOutlet, TodoToolsComponent],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
})
export class TodosComponent {
    todos = signal<Todo[]>([]);
    modalState = signal<boolean>(true);
    private searchSubject = new Subject<string>();

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
                } else {
                    this.todoService.resetTodo();
                }
            });
    }

    ngOnInit() {
        this.routeWatcher.currentUrl$.subscribe((url) => {
            if (url.includes('add') || url.includes('edit') || url.includes('details')) {
                console.log('URL changed:', url); // Logs every URL change
                this.modalState.set(true);
            } else {
                this.modalState.set(false);
            }
        });

        this.todoService.todosSubject$.subscribe((todoList) => {
            this.todos.set([...todoList]);
        });
    }

    onSearchBarChange(searchText: string) {
        this.searchSubject.next(searchText);
    }

    handleTriggerCloseModal() {
        this.router.navigate(['/']);
        this.modalState.set(false);
    }
}
