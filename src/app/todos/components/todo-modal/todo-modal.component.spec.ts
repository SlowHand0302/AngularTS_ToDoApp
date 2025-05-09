import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { TodoModalComponent } from './todo-modal.component';
import * as fromReducer from '../../../shared/stores/task/task.reducers';
import { selectLoading } from '../../../shared/stores/task/task.selectors';
import { RouteWatcherService } from '../../../shared/services/route-watcher.service';

describe('TodoModalComponent', () => {
  let component: TodoModalComponent;
  let fixture: ComponentFixture<TodoModalComponent>;
  let routeWatcherServiceMock: Pick<RouteWatcherService, 'currentUrl$'>;
  let currentUrlMock: BehaviorSubject<string>;
  let emitSpy: jest.SpyInstance;
  let store: MockStore<fromReducer.TaskState>;

  const createServices = () => {
    currentUrlMock = new BehaviorSubject<string>('/');
    routeWatcherServiceMock = {
      currentUrl$: currentUrlMock,
    };
  };

  beforeEach(async () => {
    createServices();
    const initialState: fromReducer.TaskState = {
      tasks: [],
      selectedTask: null,
      loading: new Set<string>(['']),
      error: null,
      sort: null,
      filter: null,
      search: null,
    };
    await TestBed.configureTestingModule({
      imports: [TodoModalComponent],
      providers: [
        { provide: RouteWatcherService, useValue: routeWatcherServiceMock },
        provideMockStore({
          initialState: initialState,
          selectors: [{ selector: selectLoading, value: null }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('modalState', false);
    emitSpy = jest.spyOn(component.triggerCloseModal, 'emit');
    store = TestBed.inject(Store) as MockStore<fromReducer.TaskState>;
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
    store.overrideSelector(selectLoading, new Set<string>(['add']));
    store.refreshState(); // <--- triggers re-evaluation of selectors
    fixture.detectChanges();

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
