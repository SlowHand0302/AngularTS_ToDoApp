import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { IconService, ListItem } from 'carbon-components-angular';
import { IconDirectiveMock } from '../../../__mocks__/icon-directive.mock';

import { TodoToolsComponent } from './todo-tools.component';
import { TaskActions } from '../../../shared/stores/task/task.actions';
import * as fromReducer from '../../../shared/stores/task/task.reducers';
import { todoSortList } from '../../../shared/models/sort.model';
import { IconServiceMock } from '../../../__mocks__/icon-service.mock';

// Create isolated unit tests for the component
describe('TodoToolsComponent', () => {
  let component: TodoToolsComponent;
  let store: MockStore<fromReducer.TaskState>;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    const initialState: fromReducer.TaskState = {
      tasks: [],
      selectedTask: null,
      loading: new Set<string>(['']),
      error: null,
      sort: null,
      filter: null,
      search: null,
    };

    TestBed.configureTestingModule({
      providers: [
        // Use the mock IconService
        { provide: IconService, useClass: IconServiceMock },
        { provide: 'ibmIcon', useClass: IconDirectiveMock },
        provideMockStore({
          initialState: initialState,
        }),
        TodoToolsComponent
      ]
    });

    store = TestBed.inject(Store) as MockStore<fromReducer.TaskState>;
    dispatchSpy = jest.spyOn(store, 'dispatch');
    
    // Get the component from TestBed
    component = TestBed.inject(TodoToolsComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch sort action when handleSelectSort is called', () => {
    // Create a mock sort option
    const mockSortOption = todoSortList[0];
    
    // Call the method directly
    component.handleSelectSort(mockSortOption);
    
    // Verify the dispatch was called with the correct action
    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.sortTask.set({ 
        options: { [mockSortOption.key]: mockSortOption.order } 
      })
    );
  });

  it('should dispatch filter action when handleSelectStatus is called', () => {
    // Create a mock ListItem
    const mockStatusOption: ListItem = { 
      content: 'Pending',
      selected: false
    };
    
    // Call the method directly
    component.handleSelectStatus(mockStatusOption);
    
    // Verify the dispatch was called with the correct action
    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.filterTask.set({
        options: {
          status: { in: ['Pending'] }
        }
      })
    );
  });
});