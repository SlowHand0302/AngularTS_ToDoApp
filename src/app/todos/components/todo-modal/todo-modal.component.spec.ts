import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoModalComponent } from './todo-modal.component';
import { TodoService } from '../../services/todo.service';
import { BehaviorSubject } from 'rxjs';
import { RouteWatcherService } from '../../../shared/services/route-watcher.service';

describe('TodoModalComponent', () => {
    let component: TodoModalComponent;
    let fixture: ComponentFixture<TodoModalComponent>;
    let todoServiceMock: Pick<TodoService, 'loadingSet$'>;
    let loadingSetMock: BehaviorSubject<Set<string>>;
    let routeWatcherServiceMock: Pick<RouteWatcherService, 'currentUrl$'>;
    let currentUrlMock: BehaviorSubject<string>;
    let emitSpy: jest.SpyInstance;

    const createServices = () => {
        loadingSetMock = new BehaviorSubject<Set<string>>(new Set());
        todoServiceMock = {
            loadingSet$: loadingSetMock.asObservable(),
        };
        currentUrlMock = new BehaviorSubject<string>('/');
        routeWatcherServiceMock = {
            currentUrl$: currentUrlMock,
        };
    };

    beforeEach(async () => {
        createServices();
        await TestBed.configureTestingModule({
            imports: [TodoModalComponent],
            providers: [
                { provide: TodoService, useValue: todoServiceMock },
                { provide: RouteWatcherService, useValue: routeWatcherServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoModalComponent);
        fixture.componentRef.setInput('modalState', false);
        component = fixture.componentInstance;
        emitSpy = jest.spyOn(component.triggerCloseModal, 'emit');
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit triggerCloseModal when closed', () => {
        component.handleOnCloseModal();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not emit triggerCloseModal when form is loading', () => {
        loadingSetMock.next(new Set('add'));
        component.handleOnCloseModal();
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should match the modal title to url', () => {
        currentUrlMock.next('/add');
        expect(component.modalTitle).toBe('add');
        currentUrlMock.next('/edit');
        expect(component.modalTitle).toBe('edit');
    });
});
