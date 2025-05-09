import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Router } from '@angular/router';
import { TodoItemComponent } from './todo-item.component';
import { TaskActions } from '../../../shared/stores/task/task.actions';
import * as fromReducer from '../../../shared/stores/task/task.reducers';
import { taskItemsMock } from '../../../shared/mockups/testTaskItems.mockup';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let routerMock: Pick<Router, 'navigate'>;
  let store: MockStore<fromReducer.TaskState>;

  const createServices = () => {
    routerMock = {
      navigate: jest.fn().mockImplementation(() => Promise.resolve([])),
    };
  };

  const createComponentWithTodo = () => {
    fixture = TestBed.createComponent(TodoItemComponent);
    fixture.componentRef.setInput('task', taskItemsMock[0]);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore<fromReducer.TaskState>;
    fixture.detectChanges();
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
      imports: [TodoItemComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        provideMockStore({ initialState: initialState }),
      ],
    }).compileComponents();

    createComponentWithTodo();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to detail page when detail button clicked', () => {
    component.handleViewDetails();
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/details',
      taskItemsMock[0]._id,
    ]);
  });
  it('should navigate to edit page when edit button clicked', () => {
    component.handleEdit();
    expect(routerMock.navigate).toHaveBeenCalledWith([
      '/edit',
      taskItemsMock[0]._id,
    ]);
  });
  it('should remove itself when remove button clicked and show notification if it succeed', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.handleRemove();
    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.deleteTask.request({ id: { _id: taskItemsMock[0]._id } })
    );
  });
});
