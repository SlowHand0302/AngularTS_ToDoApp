import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoFormComponent } from './todo-form.component';
import { BehaviorSubject, map, of } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { NotificationService, NotificationVariants } from '../../../shared/services/notification.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { todoList } from '../../../shared/constants/todoList.constant';
import { By } from '@angular/platform-browser';

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
    };

    beforeEach(async () => {
        createServices();
        await TestBed.configureTestingModule({
            imports: [TodoFormComponent, ReactiveFormsModule],
            providers: [
                FormBuilder,
                { provide: Router, useValue: routerMock },
                { provide: TodoService, useValue: todoServiceMock },
                { provide: NotificationService, useValue: notificationServiceMock },
                { provide: ActivatedRoute, useValue: { paramMap: paramMapSubject } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with empty inputs when url: /add', () => {
        paramMapSubject.next({
            get: (key: string) => null, // Simulating '/add' with no ID
            has: (key: string) => false,
            keys: [],
        });
        fixture.detectChanges();
        expect(component.todoForm.get('id')?.value).toBe('');
        expect(component.todoForm.get('title')?.value).toBe('');
        expect(component.todoForm.get('deadline')?.value.length).toBe(0);
        expect(component.todoForm.get('details')?.value).toBe('');
        expect(component.todoForm.get('isCompleted')?.value).toBeFalsy();
    });

    it('should create form with pre-filled inputs when url: /edit', () => {
        expect(component.todoForm.get('id')?.value).not.toBe('');
        expect(component.todoForm.get('title')?.value).not.toBe('');
        expect(component.todoForm.get('deadline')?.value).not.toBe([]);
        expect(component.todoForm.get('details')?.value).not.toBe('');
        expect(component.todoForm.get('isCompleted')?.value === false).not.toBeNull();
    });

    it('should react to paramMap changes', () => {
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

    it('should navigate to home page when home button clicked', () => {
        component.onCloseButtonClick();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should reset form to initial values when handleResetForm() called', () => {
        component.handleResetForm();
        expect(component.todoForm.get('id')?.value).toBe('');
        expect(component.todoForm.get('title')?.value).toBe('');
        expect(component.todoForm.get('deadline')?.value.length).toBe(0);
        expect(component.todoForm.get('details')?.value).toBe('');
        expect(component.todoForm.get('isCompleted')?.value).toBeFalsy();
    });

    it('should call addTodo when submitting in: /add', () => {
        const sampleTodo = {
            id: '',
            title: 'Sample Todo Title',
            deadline: [new Date('2025-10-05')], // Convert MM/DD/YYYY to ISO
            isCompleted: false,
            details: 'Sample Todo Details',
        };

        paramMapSubject.next({
            get: (key: string) => null, // Simulating '/add' with no ID
            has: (key: string) => false,
            keys: [],
        });
        fixture.detectChanges();

        component.todoForm.patchValue(sampleTodo);
        component.onSubmit();
        expect(todoServiceMock.APIEmulator).toHaveBeenCalled();
        expect(todoServiceMock.addTodo).toHaveBeenCalledWith(sampleTodo);
        expect(notificationServiceMock.showNotification).toHaveBeenCalledWith(
            NotificationVariants.NOTIFICATION,
            {
                type: 'success',
                title: 'Add Todo Success',
            },
        );
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should call editTodo when submitting in: /edit', () => {
        fixture.detectChanges();
        const sampleTodo = {
            title: 'Sample Todo edit Title',
            details: 'Sample Todo edit Details',
        };
        component.todoForm.patchValue(sampleTodo);
        component.onSubmit();

        expect(todoServiceMock.APIEmulator).toHaveBeenCalled();
        expect(todoServiceMock.editTodo).toHaveBeenCalledWith({ ...todoList[0], ...sampleTodo });
        expect(notificationServiceMock.showNotification).toHaveBeenCalledWith(
            NotificationVariants.NOTIFICATION,
            {
                type: 'success',
                title: 'Update Todo Success',
                message: `Update ${sampleTodo.title} success`,
            },
        );
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should disable submit button when form is not valid', () => {
        component.todoForm.patchValue({ title: '', deadline: [], details: '', isCompleted: false });
        expect(component.todoForm.invalid).toBeTruthy();
        fixture.detectChanges();
        const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
        expect(submitButton.properties['disabled']).toBeTruthy();
    });

    it('should render skeleton for edit form for the first time when navigating to: /edit', () => {
        let formSkeleton = fixture.debugElement.query(By.css('.form'));
        expect(formSkeleton).toBeFalsy();

        loadingSetMock.next(new Set(['loadById']));
        fixture.detectChanges();
        formSkeleton = fixture.debugElement.query(By.css('.form'));
        expect(formSkeleton).toBeTruthy();
    });

    it('should disable all button and inputs when form is submitting', () => {
        let buttons = fixture.debugElement.queryAll(By.css('.cds--btn'));
        let fields = fixture.debugElement.queryAll(By.css('input, textarea'));
        let toggle = component.todoForm.get('isCompleted')?.disabled;

        expect(toggle).toBeFalsy();
        expect(buttons.every((button) => button.properties['disabled'])).toBeFalsy();
        expect(
            fields.every(
                (field) => (field.properties['readonly'] ?? false) || (field.properties['readOnly'] ?? false),
            ),
        ).toBeFalsy();

        loadingSetMock.next(new Set(['add']));
        fixture.detectChanges();

        toggle = component.todoForm.get('isCompleted')?.disabled;
        expect(toggle).toBeTruthy();
        expect(buttons.every((button) => button.properties['disabled'])).toBeTruthy();
        expect(
            fields.every(
                (field) => (field.properties['readonly'] ?? false) || (field.properties['readOnly'] ?? false),
            ),
        ).toBeTruthy();
    });
});
