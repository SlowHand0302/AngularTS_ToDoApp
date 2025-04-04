import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject, map, of } from 'rxjs';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    ParamMap,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { TodosComponent } from './todos.component';
import { TodoService } from './services/todo.service';
import { AuthService } from '../auth/service/auth.service';
import { RouteWatcherService } from '../shared/services/route-watcher.service';
import { Todo } from '../shared/models/todo.model';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { TodoSkeletonsComponent } from './components/todo-skeletons/todo-skeletons.component';
import { TodoToolsComponent } from './components/todo-tools/todo-tools.component';
import { By } from '@angular/platform-browser';
import { todoList } from '../shared/constants/todoList.constant';

describe('TodosComponent', () => {
    let component: TodosComponent;
    let fixture: ComponentFixture<TodosComponent>;
    let routerMock: Pick<
        Router,
        'navigate' | 'events' | 'routerState' | 'url' | 'createUrlTree' | 'serializeUrl'
    >;
    let authServiceMock: Pick<AuthService, 'testReq'>;
    let paramMapSubject: BehaviorSubject<Partial<ParamMap>>;
    let routeWatcherServiceMock: Pick<RouteWatcherService, 'currentUrl$'>;
    let currentUrlMock: BehaviorSubject<string>;
    let todoServiceMock: Pick<
        TodoService,
        'APIEmulator' | 'resetTodo' | 'searchTodo' | 'isLoading' | 'todosSubject$' | 'loadingSet$'
    >;
    let todosSubjectMock: BehaviorSubject<Todo[]>;
    let loadingSetMock: BehaviorSubject<Set<string>>;

    const createServices = () => {
        routerMock = {
            navigate: jest.fn().mockImplementation(() => Promise.resolve([])),
            routerState: {
                snapshot: {
                    url: '',
                    root: new ActivatedRouteSnapshot(),
                },
                root: new ActivatedRoute(),
            },
            url: '/', // Mock current URL
            events: of(), // Mock router events as an empty observable
            createUrlTree: jest.fn().mockImplementation((commands, extras = {}) => {
                return { toString: () => commands.join('/') }; // Mock UrlTree
            }),
            serializeUrl: jest.fn().mockImplementation((urlTree) => {
                return urlTree.toString(); // Use the UrlTree's toString method
            }),
        };

        paramMapSubject = new BehaviorSubject<Partial<ParamMap>>({
            get: () => null,
            has: () => false,
            keys: [],
        });

        authServiceMock = { testReq: jest.fn().mockReturnValue(of([])) };

        currentUrlMock = new BehaviorSubject<string>('/');
        routeWatcherServiceMock = {
            currentUrl$: currentUrlMock,
        };

        todosSubjectMock = new BehaviorSubject<Todo[]>([]);
        loadingSetMock = new BehaviorSubject<Set<string>>(new Set());

        todoServiceMock = {
            APIEmulator: jest.fn().mockImplementation((callback) => callback()),
            resetTodo: jest.fn().mockReturnValue(of(null)),
            todosSubject$: todosSubjectMock,
            searchTodo: jest.fn().mockReturnValue(of(null)),
            isLoading: jest
                .fn()
                .mockImplementation((requestId: string) =>
                    loadingSetMock.asObservable().pipe(map((set) => set.has(requestId))),
                ),
            loadingSet$: loadingSetMock.asObservable(),
        };
    };

    beforeEach(async () => {
        createServices();
        await TestBed.configureTestingModule({
            imports: [
                TodosComponent,
                TodoModalComponent,
                TodoItemComponent,
                RouterLink,
                RouterOutlet,
                TodoToolsComponent,
                TodoSkeletonsComponent,
            ],
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: TodoService, useValue: todoServiceMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: RouteWatcherService, useValue: routeWatcherServiceMock },
                { provide: ActivatedRoute, useValue: { paramMap: paramMapSubject } },
            ],
        }).compileComponents();

        jest.useFakeTimers();
        fixture = TestBed.createComponent(TodosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open or close modal base on current url', () => {
        expect(component.modalState()).toBeFalsy();
        currentUrlMock.next('/add');
        expect(component.modalState()).toBeTruthy();
        currentUrlMock.next('/');
        expect(component.modalState()).toBeFalsy();
        currentUrlMock.next('/edit');
        expect(component.modalState()).toBeTruthy();
    });

    it('should close modal when handleTriggerCloseModal called', () => {
        component.handleTriggerCloseModal();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
        expect(component.modalState()).toBeFalsy();
    });

    it('should load all todos when loadingTodos called', () => {
        component.loadingTodos();
        expect(todoServiceMock.APIEmulator).toHaveBeenCalled();
        expect(todoServiceMock.resetTodo).toHaveBeenCalled();
    });

    it('should load update loading state base on loadingID = loadTodos', () => {
        expect(component.isLoading()).toBeFalsy();
        loadingSetMock.next(new Set(['loadTodos']));
        fixture.detectChanges();
        expect(component.isLoading()).toBeTruthy();
        loadingSetMock.next(new Set(['loadById']));
        fixture.detectChanges();
        expect(component.isLoading()).toBeFalsy();
    });

    it('should render skeleton base on isLoading state', () => {
        expect(component.isLoading()).toBeFalsy();
        let skeleton = fixture.debugElement.query(By.css('.todo-item-skeleton'));
        expect(skeleton).toBeFalsy();
        loadingSetMock.next(new Set(['loadTodos']));
        fixture.detectChanges();
        skeleton = fixture.debugElement.query(By.css('.todo-item-skeleton'));
        expect(component.isLoading()).toBeTruthy();
        expect(skeleton).toBeTruthy();
    });

    it('should render the empty list when todos is empty', () => {
        expect(component.todos().length).toBe(0);
        expect(component.isLoading()).toBeFalsy();
        let emptyList = fixture.debugElement.query(By.css('.todos_empty'));
        expect(emptyList).toBeTruthy();

        todosSubjectMock.next([...todoList]);
        fixture.detectChanges();
        emptyList = fixture.debugElement.query(By.css('.todos_empty'));
        expect(component.todos().length).not.toEqual(0);
        expect(emptyList).toBeFalsy();
    });

    it('should search todo base on search text', () => {
        component.onSearchBarChange('c');
        fixture.detectChanges();
        expect(todoServiceMock.APIEmulator).toHaveBeenCalled();
        jest.advanceTimersByTime(300);
        expect(todoServiceMock.searchTodo).toHaveBeenCalledWith('c');
    });

    it('should call authService.testReq when loadingAPITest called', () => {
        component.loadingAPITest();
        expect(authServiceMock.testReq).toHaveBeenCalled();
    });
});
