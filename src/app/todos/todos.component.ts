import { Component, OnChanges, signal, SimpleChanges } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { Todo } from '../shared/models/todo.model';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RouteWatcherService } from '../shared/services/route-watcher.service';
import { TodoService } from './services/todo.service';

@Component({
    selector: 'app-todos',
    imports: [SharedModule, TodoModalComponent, TodoItemComponent, RouterLink, RouterOutlet],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
})
export class TodosComponent {
    todos = signal<Todo[]>([]);
    modalState = signal<boolean>(false);

    constructor(private router: Router, private routeWatcher: RouteWatcherService, private todoService: TodoService) {}

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

    handleTriggerCloseModal() {
        this.router.navigate(['/']);
        this.modalState.set(false);
    }
}
