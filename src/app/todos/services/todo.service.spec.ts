import { TestBed } from '@angular/core/testing';

import { Subscription } from 'rxjs';
import { TodoService } from './todo.service';
import { Todo } from '../../shared/models/todo.model';
import { todoSortList } from '../../shared/models/sort.model';
import { filterOutput, sortOutput } from '../../shared/mockups/testTodoService.mockup';
import { todoFilterList } from '../../shared/models/filter.model';
import { todoList } from '../../shared/constants/todoList.contants';

describe('TodoService', () => {
    let service: TodoService;
    let mockLoadingSet: Set<string> = new Set();
    let mockTodos: Todo[] = [];
    let loadingSubscription: Subscription;
    let todosSubscription: Subscription;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TodoService);
        loadingSubscription = service.loadingSet$.subscribe((loading) => {
            console.log(loading.values());
            mockLoadingSet = new Set(Array.from(loading));
        });
        todosSubscription = service.todosSubject$.subscribe((todos) => {
            mockTodos = [...todos];
        });
        jest.useFakeTimers();
    });

    afterEach(() => {
        loadingSubscription.unsubscribe();
        todosSubscription.unsubscribe();
        jest.clearAllTimers();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should intiate with empty array', () => {
        expect(mockTodos.length).toBe(0);
    });

    it('should load all todos', () => {
        service.resetTodo();
        expect(mockTodos.length).toBeGreaterThan(0);
    });

    it('should find by id', () => {
        service.resetTodo();
        const todo = service.findTodoById(1);
        expect(todo).not.toBeNull();
        expect(todo).toMatchObject(mockTodos.find((item) => item.id === 1) ?? {});
    });

    it('should add new ToDo: ', () => {
        const sampleTodo: Omit<Todo, 'id'> = {
            title: 'Sample Title',
            deadline: [new Date('2025-10-05')],
            isCompleted: false,
            details: 'Sample Details',
        };
        service.addTodo(sampleTodo);
        expect(mockTodos.length).toBe(1);
        expect(mockTodos[0]).toMatchObject(sampleTodo);
    });

    it('should edit Todo', () => {
        const sampleTodo = {
            id: 1,
            title: 'Sample Title',
            deadline: [new Date('2025-10-05')],
            isCompleted: false,
            details: 'Sample Details',
        };
        service.resetTodo();
        expect(mockTodos.length).toBeGreaterThan(0);
        service.editTodo(sampleTodo);
        expect(mockTodos.find((item) => item.id === sampleTodo.id)).toMatchObject(sampleTodo);
    });

    it('should remove Todo by id', () => {
        service.resetTodo();
        expect(mockTodos.length).toBeGreaterThan(0);
        service.removeTodo(1);
        expect(mockTodos).not.toContainEqual(mockTodos.find((item) => item.id === 1));
    });

    it.each(todoSortList)(
        'should set sort option and sort todos base on the given options: $key $order',
        (sortOption) => {
            service.resetTodo();
            expect(mockTodos.length).toBeGreaterThan(0);
            service.setSortOption(sortOption);
            expect(mockTodos).toEqual(sortOutput[`${sortOption.key} ${sortOption.order}`]);
        },
    );

    it.each(todoFilterList)(
        'should set filter option and filter todos base on the given options: $key $content',
        (filterOption) => {
            service.resetTodo();
            expect(mockTodos.length).toBeGreaterThan(0);
            service.setFilterOption(filterOption);
            jest.advanceTimersByTime(500);
            expect(mockTodos).toEqual(filterOutput[`${filterOption.key} ${filterOption.value}`]);
        },
    );

    it('should show list todos that include the search text', () => {
        service.resetTodo();
        expect(mockTodos.length).toBeGreaterThan(0);
        service.searchTodo('com');
        expect(mockTodos).toEqual(todoList.filter((item) => item.title.toLowerCase().includes('com')));
    });

    it('should delay its function to emulate api request', () => {
        const sampleTodo: Omit<Todo, 'id'> = {
            title: 'Sample Title',
            deadline: [new Date('2025-10-05')],
            isCompleted: false,
            details: 'Sample Details',
        };
        service.APIEmulator(() => service.addTodo(sampleTodo), 'add todo').subscribe();
        expect(mockLoadingSet).toContain('add todo');
        jest.advanceTimersByTime(500);
        expect(mockTodos.length).toBe(1);
        expect(mockTodos[0]).toMatchObject(sampleTodo);
        expect(mockLoadingSet.size).toBe(0);
    });

    it('should return loading state by loading id', () => {
        const sampleTodo: Omit<Todo, 'id'> = {
            title: 'Sample Title',
            deadline: [new Date('2025-10-05')],
            isCompleted: false,
            details: 'Sample Details',
        };
        service.APIEmulator(() => service.addTodo(sampleTodo), 'add todo').subscribe();
        expect(mockLoadingSet).toContain('add todo');
        expect(service.isLoading('add todo')).toBeTruthy();

        jest.advanceTimersByTime(500);
        expect(mockTodos.length).toBe(1);
        expect(mockTodos[0]).toMatchObject(sampleTodo);
        expect(mockLoadingSet.size).toBe(0);
    });
});
