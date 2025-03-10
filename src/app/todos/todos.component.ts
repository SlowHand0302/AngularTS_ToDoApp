import { Component, signal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { Todo, todoList } from '../shared/models/todo.model';

@Component({
    selector: 'app-todos',
    imports: [SharedModule, TodoModalComponent, TodoItemComponent, TodoFormComponent],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
})
export class TodosComponent {
    todos = signal<Todo[]>(todoList);
    modalState = signal<boolean>(false);
    selectedTodo = signal<Todo | null>(null);

    onOptionsClick(todo: Todo) {
        // console.log(todo);
    }

    handleAddTodo(todo: Todo) {
        this.todos.update((prev) => (prev = [{ ...todo, id: `${this.todos().length + 1}` }, ...prev]));
    }

    handleEditTodo(todo: Todo) {
        this.todos.update((prev) => (prev = [...prev.map((item) => (item.id === todo.id ? { ...todo } : item))]));
    }

    handleRemoveTodo(todo: Todo) {
        this.todos.update((prev) => (prev = prev.filter((item) => item.id !== todo.id)));
    }

    handleTriggerOpenModal(todo: Todo | null) {
        this.modalState.set(true);
        this.selectedTodo.set(todo);
    }
}
