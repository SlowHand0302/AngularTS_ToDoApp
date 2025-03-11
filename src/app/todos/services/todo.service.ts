import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo, todoList } from '../../shared/models/todo.model';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private todosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>(todoList);
    public todosSubject$: Observable<Todo[]> = this.todosSubject.asObservable();

    public findTodoById(todoId: number | string): Todo | null {
        return this.todosSubject.value.find((item) => item.id == todoId) ?? null;
    }

    public addTodo(todo: Todo) {
        this.todosSubject.next([{ ...todo, id: this.todosSubject.value.length + 1 }, ...this.todosSubject.value]);
    }

    public editTodo(todo: Todo) {
        this.todosSubject.next([...this.todosSubject.value.map((item) => (item.id === todo.id ? todo : item))]);
    }

    public removeTodo(todoId: number | string) {
        this.todosSubject.next([...this.todosSubject.value.filter((item) => item.id != todoId)]);
    }
}
