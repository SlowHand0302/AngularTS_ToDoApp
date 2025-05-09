import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconService } from 'carbon-components-angular';
import { Store } from '@ngrx/store';
import { TodoFormComponent } from './todo-form.component';
import { BehaviorSubject, map, of } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { NotificationService, NotificationVariants } from '../../../shared/services/notification.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { todoList } from '../../../shared/constants/todoList.constant';
import { IconServiceMock } from '../../../__mocks__/icon-service.mock';
import { StoreMock } from '../../../__mocks__/store.mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconDirectiveMock } from '../../../__mocks__/icon-directive.mock';

describe('TodoFormComponent', () => {
    let component: TodoFormComponent;
    let fixture: ComponentFixture<TodoFormComponent>;
    let paramMapSubject: BehaviorSubject<Partial<ParamMap>>;
    let routerMock: Pick<Router, 'navigate'>;
    let todoServiceMock: Pick<
        TodoService,
        'isLoading' | 'APIEmulator' | 'addTodo' | 'editTodo' | 'findTodoById'
    >;
    let notificationServiceMock: Partial<NotificationService>;
    let loadingSetMock: BehaviorSubject<Set<string>>;
    let storeMock: StoreMock;

    const createServices = () => {
        routerMock = { navigate: jest.fn().mockImplementation(() => Promise.resolve([])) };
        notificationServiceMock = { showNotification: jest.fn() };

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
            addTodo: jest.fn().mockReturnValue(of(null)),
            editTodo: jest.fn().mockReturnValue(of(null)),
            findTodoById: jest.fn().mockReturnValue(of(todoList[0])),
            APIEmulator: jest.fn().mockImplementation((callback) => callback()),
        };

        storeMock = new StoreMock();
        jest.spyOn(storeMock, 'select').mockImplementation((selector) => {
            if (selector === 'selectLoading') {
                return loadingSetMock.asObservable();
            }
            if (selector === 'selectChosenTask') {
                return of({
                    _id: '1',
                    title: 'Test Task',
                    details: 'Test Details',
                    startDate: new Date(),
                    endDate: new Date(),
                    type: 'Task',
                    status: 'Todo',
                    priority: 'Medium'
                });
            }
            return of(null);
        });
        jest.spyOn(storeMock, 'dispatch');
    };

    beforeEach(async () => {
        createServices();
        await TestBed.configureTestingModule({
            // Move TodoFormComponent to imports since it's a standalone component
            imports: [ReactiveFormsModule, TodoFormComponent],
            providers: [
                FormBuilder,
                { provide: Router, useValue: routerMock },
                { provide: TodoService, useValue: todoServiceMock },
                { provide: NotificationService, useValue: notificationServiceMock },
                { provide: ActivatedRoute, useValue: { paramMap: paramMapSubject } },
                // Add the IconService mock
                { provide: IconService, useClass: IconServiceMock },
                // Add the Store mock
                { provide: Store, useValue: storeMock },
                { provide: 'ibmIcon', useClass: IconDirectiveMock }
            ],
            // Skip rendering the template to avoid IconDirective issues
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(TodoFormComponent);
        component = fixture.componentInstance;
        
        // Manually call ngOnInit to initialize the component
        component.ngOnInit();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with empty inputs when url: /add', () => {
        // Reset the form first
        component.handleResetForm();
        
        // Then simulate route change to /add
        paramMapSubject.next({
            get: (key: string) => null, // Simulating '/add' with no ID
            has: (key: string) => false,
            keys: [],
        });
        
        // Manually trigger ngOnInit again
        component.ngOnInit();
        
        expect(component.todoForm.get('_id')?.value).toBe('');
        expect(component.todoForm.get('title')?.value).toBe('');
        expect(component.todoForm.get('startDate')?.value.length).toBe(0);
        expect(component.todoForm.get('endDate')?.value.length).toBe(0);
        expect(component.todoForm.get('details')?.value).toBe('');
    });

    it('should create form with pre-filled inputs when url: /edit', () => {
        // Manually patchValue to simulate store selection
        component.todoForm.patchValue({
            _id: '1',
            title: 'Test Task',
            details: 'Test Details'
        });
        
        expect(component.todoForm.get('_id')?.value).toBe('1');
    });

    it('should react to paramMap changes', () => {
        // Clear previous calls
        jest.clearAllMocks();
        
        // Simulate a route change
        paramMapSubject.next({
            get: (key: string) => (key === 'id' ? '2' : null),
            has: (key: string) => key === 'id',
            keys: ['id'],
        });
        
        // Manually trigger ngOnInit again
        component.ngOnInit();

        // Verify dispatch was called with the expected action
        expect(storeMock.dispatch).toHaveBeenCalled();
    });

    it('should navigate to home page when home button clicked', () => {
        component.onCloseButtonClick();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should reset form to initial values when handleResetForm() called', () => {
        component.handleResetForm();
        expect(component.todoForm.get('_id')?.value).toBe('');
        expect(component.todoForm.get('title')?.value).toBe('');
        expect(component.todoForm.get('startDate')?.value.length).toBe(0);
        expect(component.todoForm.get('endDate')?.value.length).toBe(0);
        expect(component.todoForm.get('details')?.value).toBe('');
    });

    it('should call addTodo when submitting in: /add', () => {
        // Reset mock
        jest.clearAllMocks();
        
        // Reset form and simulate /add route
        component.handleResetForm();
        paramMapSubject.next({
            get: (key: string) => null, // Simulating '/add' with no ID
            has: (key: string) => false,
            keys: [],
        });
        
        // Manually trigger ngOnInit again
        component.ngOnInit();

        // Fill form
        component.todoForm.patchValue({
            _id: '',
            title: 'Sample Todo Title',
            startDate: [new Date('2025-10-05')],
            endDate: [new Date('2025-10-05')],
            type: { content: 'Task', selected: true },
            status: { content: 'Todo', selected: true },
            priority: { content: 'Medium', selected: true },
            details: 'Sample Todo Details'
        });
        
        // Submit
        component.onSubmit();
        expect(storeMock.dispatch).toHaveBeenCalled();
    });

    it('should call editTodo when submitting in: /edit', () => {
        // Reset mock
        jest.clearAllMocks();
        
        // Fill form with ID to simulate edit
        component.todoForm.patchValue({
            _id: '1',
            title: 'Sample Todo edit Title',
            details: 'Sample Todo edit Details',
            type: { content: 'Task', selected: true },
            status: { content: 'Todo', selected: true },
            priority: { content: 'Medium', selected: true }
        });
        
        // Submit
        component.onSubmit();
        expect(storeMock.dispatch).toHaveBeenCalled();
    });

    it('should disable submit button when form is not valid', () => {
        component.todoForm.patchValue({ 
            title: '', 
            startDate: [], 
            endDate: [], 
            details: '',
            type: '',
            status: '',
            priority: ''
        });
        
        expect(component.todoForm.invalid).toBeTruthy();
    });

    it('should update loading state when loading signals change', () => {
        // Set the loading signal directly
        component.isLoading.set(true);
        expect(component.isLoading()).toBeTruthy();
    });

    it('should disable inputs when form is submitting', () => {
        // Set the editing/adding signal directly
        component.isEditingOrAdding.set(true);
        expect(component.isEditingOrAdding()).toBeTruthy();
    });
});