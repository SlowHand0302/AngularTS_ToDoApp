import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of, tap } from 'rxjs';
import { Todo } from '../../shared/models/todo.model';
import { todoList } from '../../shared/constants/todoList.contants';
import { SortOption } from '../../shared/models/sort.model';
import { FilterOption } from '../../shared/models/filter.model';

@Injectable({
    providedIn: 'root',
})
export class TodoService {
    private todosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
    private todoFilterOption: BehaviorSubject<FilterOption<Todo>[]> = new BehaviorSubject<FilterOption<Todo>[]>([]);
    private todoSortOption: BehaviorSubject<SortOption<Todo>> = new BehaviorSubject<SortOption<Todo>>({
        key: 'title',
        order: 'asc',
    });
    private loadingSet = new BehaviorSubject<Set<string>>(new Set());
    public loadingSet$ = this.loadingSet.asObservable();
    public todosSubject$: Observable<Todo[]> = this.todosSubject.asObservable();

    public findTodoById(todoId: number | string): Todo | null {
        return todoList.find((item) => item.id == todoId) ?? null;
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

    public setFilterOption(option: FilterOption<Todo>) {
        if (this.todoFilterOption.value.length <= 0) {
            this.todoFilterOption.next([...this.todoFilterOption.value, option]);
        } else if (option.value === null) {
            this.todoFilterOption.next([...this.todoFilterOption.value.filter((item) => item.key !== option.key)]);
        } else {
            this.todoFilterOption.next([
                ...this.todoFilterOption.value.map((item) => (item.key === option.key ? option : item)),
            ]);
        }
        this.APIEmulator(() => this.filterTodo(), 'loadTodos').subscribe();
    }

    public setSortOption(option: SortOption<Todo>) {
        this.todoSortOption.next({ ...option });
        this.sortTodo();
    }

    public sortTodo() {
        // console.log(this.todoSortOption.value);
        this.todosSubject.next([
            ...this.todosSubject.value.sort((a, b) => {
                const valueA = a[this.todoSortOption.value.key];
                const valueB = b[this.todoSortOption.value.key];

                // Sorting for Date
                if (valueA instanceof Object && valueB instanceof Object) {
                    return this.todoSortOption.value.order === 'asc'
                        ? valueA[0].getTime() - valueB[0].getTime()
                        : valueB[0].getTime() - valueA[0].getTime();
                }

                // Sorting for String
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return this.todoSortOption.value.order === 'asc'
                        ? valueA.localeCompare(valueB)
                        : valueB.localeCompare(valueA);
                }

                // Sorting for Number and Boolean
                if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return this.todoSortOption.value.order === 'asc' ? valueA - valueB : valueB - valueA;
                }

                return 0;
            }),
        ]);
    }

    public filterTodo() {
        const filtered = todoList.filter((item) => {
            return this.todoFilterOption.value.every((filter) => {
                const itemValue = item[filter.key];
                return filter.value === itemValue;
            });
        });
        this.todosSubject.next([...filtered]);
    }

    public searchTodo(searchText: string) {
        this.todosSubject.next([
            ...todoList.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase())),
        ]);
    }

    public resetTodo() {
        this.todosSubject.next([...todoList.sort((a, b) => a.title.localeCompare(b.title))]);
    }

    public APIEmulator<T = void>(fn: () => T, requestId: string): Observable<T> {
        return of(null).pipe(
            tap(() => this.addLoading(requestId)), // Start loading
            delay(500),
            map(() => fn()), // Execute function
            tap(() => this.removeLoading(requestId)), // Stop loading
        );
    }

    private addLoading(requestId: string) {
        const currentState = new Set(this.loadingSet.value);
        currentState.add(requestId);
        this.loadingSet.next(currentState);
        // console.log(this.loadingSet.value);
    }

    private removeLoading(requestId: string) {
        const currentState = new Set(this.loadingSet.value);
        currentState.delete(requestId);
        this.loadingSet.next(currentState);
        // console.log(this.loadingSet.value);
    }

    public isLoading(requestId: string): Observable<boolean> {
        return this.loadingSet$.pipe(map((set) => set.has(requestId)));
    }
}
