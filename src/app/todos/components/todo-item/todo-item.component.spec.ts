import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemComponent } from './todo-item.component';
import { todoList } from '../../../shared/constants/todoList.constant';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { NotificationService, NotificationVariants } from '../../../shared/services/notification.service';
import { of } from 'rxjs';

describe('TodoItemComponent', () => {
    let component: TodoItemComponent;
    let fixture: ComponentFixture<TodoItemComponent>;
    let routerMock: Pick<Router, 'navigate'>;
    let todoServiceMock: Pick<TodoService, 'APIEmulator' | 'removeTodo' | 'editTodo'>;
    let notificationServiceMock: Partial<NotificationService>;

    const createServices = () => {
        routerMock = {
            navigate: jest.fn().mockImplementation(() => Promise.resolve([])),
        };

        todoServiceMock = {
            removeTodo: jest.fn().mockReturnValue(of(null)),
            editTodo: jest.fn().mockReturnValue(of(null)),
            APIEmulator: jest.fn().mockImplementation((callback) => callback()),
        };

        notificationServiceMock = {
            showNotification: jest.fn(),
        };
    };

    const createComponentWithTodo = () => {
        fixture = TestBed.createComponent(TodoItemComponent);
        fixture.componentRef.setInput('todo', todoList[0]);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    beforeEach(async () => {
        createServices();
        await TestBed.configureTestingModule({
            imports: [TodoItemComponent],
            providers: [
                {
                    provide: NotificationService,
                    useValue: notificationServiceMock,
                },
                { provide: TodoService, useValue: todoServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();

        createComponentWithTodo();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to detail page when detail button clicked', () => {
        component.handleViewDetails();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/details', todoList[0].id]);
    });
    it('should navigate to edit page when edit button clicked', () => {
        component.handleEdit();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/edit', todoList[0].id]);
    });
    it('should update todo isCompleted attribute when checkbox change', () => {
        const updatedTodo = { ...todoList[0], isCompleted: !todoList[0].isCompleted };
        component.handleUpdateState();
        expect(todoServiceMock.editTodo).toHaveBeenCalledWith(updatedTodo);
    });
    it('should remove itself when remove button clicked and show notification if it succeed', () => {
        component.handleRemove();
        expect(todoServiceMock.APIEmulator).toHaveBeenCalled();
        expect(todoServiceMock.removeTodo).toHaveBeenCalledWith(todoList[0].id);
        expect(notificationServiceMock.showNotification).toHaveBeenCalledWith(NotificationVariants.TOAST, {
            type: 'success',
            title: 'Remove Todo Success',
            subtitle: '',
            caption: `Todo ${todoList[0].title} is Removed`,
        });
    });
});
