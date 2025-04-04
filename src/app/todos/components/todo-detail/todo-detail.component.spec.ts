import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetailComponent } from './todo-detail.component';
import { TodoService } from '../../services/todo.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { todoList } from '../../../shared/constants/todoList.constant';
import { TodoSkeletonsComponent } from '../todo-skeletons/todo-skeletons.component';
import { Todo } from '../../../shared/models/todo.model';
import { By } from '@angular/platform-browser';

describe('TodoDetailComponent', () => {
    let component: TodoDetailComponent;
    let fixture: ComponentFixture<TodoDetailComponent>;
    let todoServiceMock: Pick<TodoService, 'APIEmulator' | 'isLoading' | 'findTodoById' | 'loadingSet$'>;
    let paramMapSubject: BehaviorSubject<Partial<ParamMap>>;
    let loadingSetMock: BehaviorSubject<Set<string>>;

    const createServices = () => {
        paramMapSubject = new BehaviorSubject<Partial<ParamMap>>({
            get: (key: string) => (key === 'id' ? '1' : null),
            has: (key: string) => key === 'id',
            keys: ['id'],
        });
        loadingSetMock = new BehaviorSubject<Set<string>>(new Set());
        todoServiceMock = {
            isLoading: jest
                .fn()
                .mockImplementation((requestId: string) =>
                    loadingSetMock.asObservable().pipe(map((set) => set.has(requestId))),
                ),
            findTodoById: jest.fn().mockReturnValue(of(todoList[0])),
            APIEmulator: jest
                .fn()
                .mockImplementation((callback: () => Observable<Todo | null>) => callback()),
            loadingSet$: loadingSetMock.asObservable(),
        };
    };

    beforeEach(async () => {
        createServices();
        await TestBed.configureTestingModule({
            imports: [TodoDetailComponent, TodoSkeletonsComponent],
            providers: [
                { provide: ActivatedRoute, useValue: { paramMap: paramMapSubject } },
                { provide: TodoService, useValue: todoServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should initiate with todo and isLoading = false', () => {
        expect(component).toBeTruthy();
        expect(component.isLoading()).toBeFalsy();
        expect(component.todo).not.toBeNull();
    });

    it('should get the todo from id in the param', () => {
        fixture.detectChanges();

        expect(todoServiceMock.APIEmulator).toHaveBeenCalled();
        expect(todoServiceMock.findTodoById).toHaveBeenCalledWith(1);
        expect(component.todo).toEqual(todoList[0]);
    });

    it('should react to paramMap changes', () => {
        fixture.detectChanges();

        expect(todoServiceMock.APIEmulator).toHaveBeenCalled();
        expect(todoServiceMock.findTodoById).toHaveBeenCalledWith(1);

        // Simulate a route change
        paramMapSubject.next({
            get: (key: string) => (key === 'id' ? '2' : null),
            has: (key: string) => key === 'id',
            keys: ['id'],
        });
        fixture.detectChanges();

        expect(todoServiceMock.APIEmulator).toHaveBeenCalled();
        expect(todoServiceMock.findTodoById).toHaveBeenCalledWith(2);
    });

    it('should update loading state when isLoading change', async () => {
        // Simulate loading state change
        loadingSetMock.next(new Set(['loadById']));
        todoServiceMock.findTodoById('loadById');
        fixture.detectChanges();
        expect(component.isLoading()).toBeTruthy();

        // Simulate loading complete
        loadingSetMock.next(new Set());
        fixture.detectChanges();
        expect(component.isLoading()).toBeFalsy();
    });

    it('should render skeleton base on isLoading state', () => {
        fixture.detectChanges();
        let formSkeleton = fixture.debugElement.query(By.css('.details'));
        expect(formSkeleton).toBeFalsy();

        loadingSetMock.next(new Set(['loadById']));
        fixture.detectChanges();
        formSkeleton = fixture.debugElement.query(By.css('.details'));
        expect(formSkeleton).toBeTruthy();
    });
});
