import { Component, OnChanges, signal, SimpleChanges } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { Todo, todoList } from '../shared/models/todo.model';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RouteWatcherService } from '../shared/services/route-watcher.service';

@Component({
    selector: 'app-todos',
    imports: [SharedModule, TodoModalComponent, TodoItemComponent, RouterLink, RouterOutlet],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnChanges {
    todos = signal<Todo[]>(todoList);
    modalState = signal<boolean>(false);
    selectedTodo = signal<Todo | null>(null);

    constructor(private router: Router, private routeWatcher: RouteWatcherService) {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.todos);
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
    }
    
    handleAddTodo(todo: Todo) {
        this.todos.update((prev) => (prev = [{ ...todo, id: this.todos().length + 1 }, ...prev]));
    }

    handleEditTodo(todo: Todo) {
        this.todos.update((prev) => (prev = [...prev.map((item) => (item.id === todo.id ? { ...todo } : item))]));
    }

    handleRemoveTodo(todo: Todo) {
        this.todos.update((prev) => (prev = prev.filter((item) => item.id !== todo.id)));
    }

    // handleTriggerOpenModal(todo: Todo | null) {
    //     this.modalState.set(true);
    //     this.selectedTodo.set(todo);
    // }

    handleTriggerCloseModal() {
        this.router.navigate(['/']);
        this.modalState.set(false);
    }
}
