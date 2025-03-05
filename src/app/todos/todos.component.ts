import { Component, OnChanges, signal, SimpleChanges } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { Todo, todoList } from '../shared/models/todo.model';

@Component({
    selector: 'app-todos',
    imports: [SharedModule, TodoModalComponent, TodoItemComponent],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
})
export class TodosComponent {
    todos = signal<Todo[]>(todoList);
    triggerModal = signal<boolean>(false);
    selectedTodo = signal<Todo | null>(null);

    onOptionsClick(todo: Todo) {
        console.log(todo);
    }

    handleAddTodo() {}

    handleEditTodo(todo: Todo) {}

    handleRemoveTodo(todo: Todo) {
        console.log(todo);
    }

    handleTriggerOpenModal(todo: Todo | null) {
        this.triggerModal.set(true);
        this.selectedTodo.set(todo);
        console.log(todo);
    }
}
