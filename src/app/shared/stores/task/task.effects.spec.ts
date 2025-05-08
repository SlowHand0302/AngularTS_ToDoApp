import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import {
  NotificationService,
  NotificationVariants,
} from '../../services/notification.service';
import { TaskEffects } from './task.effects';
import { TaskActions } from './task.actions';
import { Task } from '../../models/task.model';
import * as fromReducer from './task.reducers';
import { TaskStatus } from '../../constants/variants.enum';
import { SortQuery } from '../../API/models/SortQuery.type';
import { TaskService } from '../../API/services/task.service';
import { taskItemsMock } from '../../mockups/testTaskItems.mockup';
import {
  selectFilterQuery,
  selectSearchQuery,
  selectSortQuery,
} from './task.selectors';
import { RawFilterQuery } from '@app/shared/API/models/FilterQuery.type';
import { SearchQuery } from '@app/shared/API/models/SearchQuery.type';

describe('Task Effects', () => {
  const mockError = new Error('Server failed');
  let actions$: Observable<Action>;
  let effects: TaskEffects;
  let metadata: EffectsMetadata<TaskEffects>;
  let service: TaskService;
  let store: MockStore<fromReducer.TaskState>;
  let notificationService: NotificationService;
  let routerMock: Pick<Router, 'navigate'>;

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
        TaskEffects,
        TaskService,
        NotificationService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: initialState,
          selectors: [
            { selector: selectFilterQuery, value: null },
            { selector: selectSortQuery, value: null },
            { selector: selectSearchQuery, value: null },
          ],
        }),
      ],
    });
    service = TestBed.inject(TaskService);
    effects = TestBed.inject(TaskEffects);
    metadata = getEffectsMetadata(effects);
    notificationService = TestBed.inject(NotificationService);
    store = TestBed.inject(Store) as MockStore<fromReducer.TaskState>;
    routerMock = {
      navigate: jest.fn().mockImplementation(() => Promise.resolve([])),
    };
  });
  describe('loadTasks$', () => {
    const action = TaskActions.loadTasks.request();
    it('should dispatch loadTasks.success on success', async () => {
      service.loadAllTasks = jest
        .fn()
        .mockReturnValue(of({ data: taskItemsMock }));
      actions$ = of(action);
      const result = await firstValueFrom(effects.loadTasks$);
      expect(result).toEqual(
        TaskActions.loadTasks.success({ tasks: taskItemsMock })
      );
    });
    it('should dispatch loadTasks.error on error', async () => {
      service.loadAllTasks = jest
        .fn()
        .mockReturnValue(throwError(() => mockError));
      actions$ = of(action);
      const result = await firstValueFrom(effects.loadTasks$);
      expect(result).toEqual(
        TaskActions.loadTasks.error({ error: mockError.message })
      );
    });
  });
  describe('loadTaskByID$', () => {
    const action = TaskActions.loadTaskByID.request({ taskID: { _id: '1' } });
    it('should dispatch loadTaskByID.success on success', async () => {
      service.loadTaskById = jest
        .fn()
        .mockReturnValue(of({ data: taskItemsMock[0] }));
      actions$ = of(action);
      const result = await firstValueFrom(effects.loadTaskByID$);
      expect(result).toEqual(
        TaskActions.loadTaskByID.success({ task: taskItemsMock[0] })
      );
    });
    it('should dispatch loadTaskByID.error on error', async () => {
      service.loadTaskById = jest
        .fn()
        .mockReturnValue(throwError(() => mockError));
      actions$ = of(action);
      const result = await firstValueFrom(effects.loadTaskByID$);
      expect(result).toEqual(
        TaskActions.loadTaskByID.error({ error: mockError.message })
      );
    });
  });
  describe('loadTasksByUserID$', () => {
    const action = TaskActions.loadTasksByUserID.request({
      userID: { creator: '1' },
    });
    it('should dispatch loadTasksByUserID.success on success', async () => {
      service.loadTaskByUserId = jest
        .fn()
        .mockReturnValue(of({ data: taskItemsMock }));
      actions$ = of(action);
      const result = await firstValueFrom(effects.loadTasksByUserID$);
      expect(result).toEqual(
        TaskActions.loadTasksByUserID.success({ tasks: taskItemsMock })
      );
    });
    it('should dispatch loadTasksByUserID.error on error', async () => {
      service.loadTaskByUserId = jest
        .fn()
        .mockReturnValue(throwError(() => mockError));
      actions$ = of(action);
      const result = await firstValueFrom(effects.loadTasksByUserID$);
      expect(result).toEqual(
        TaskActions.loadTasksByUserID.error({ error: mockError.message })
      );
    });
  });
  describe('createTask$', () => {
    const action = TaskActions.createTask.request({
      task: taskItemsMock[0],
    });
    it('should dispatch createTask.success on success', async () => {
      service.createTask = jest
        .fn()
        .mockReturnValue(of({ data: taskItemsMock[0] }));
      actions$ = of(action);
      const result = await firstValueFrom(effects.createTask$);
      expect(result).toEqual(
        TaskActions.createTask.success({ task: taskItemsMock[0] })
      );
    });
    it('should dispatch createTask.error on error', async () => {
      service.createTask = jest
        .fn()
        .mockReturnValue(throwError(() => mockError));
      actions$ = of(action);
      const result = await firstValueFrom(effects.createTask$);
      expect(result).toEqual(
        TaskActions.createTask.error({ error: mockError.message })
      );
    });
  });
  describe('updateTask$', () => {
    const action = TaskActions.updateTask.request({
      task: taskItemsMock[0],
    });
    it('should dispatch updateTask.success on success', async () => {
      service.updateTaskById = jest
        .fn()
        .mockReturnValue(of({ data: taskItemsMock[0] }));
      actions$ = of(action);
      const result = await firstValueFrom(effects.updateTask$);
      expect(result).toEqual(
        TaskActions.updateTask.success({ task: taskItemsMock[0] })
      );
    });
    it('should dispatch updateTask.error on error', async () => {
      service.updateTaskById = jest
        .fn()
        .mockReturnValue(throwError(() => mockError));
      actions$ = of(action);
      const result = await firstValueFrom(effects.updateTask$);
      expect(result).toEqual(
        TaskActions.updateTask.error({ error: mockError.message })
      );
    });
  });
  describe('deleteTask$', () => {
    const action = TaskActions.deleteTask.request({
      id: { _id: '1' },
    });
    it('should dispatch deleteTask.success on success', async () => {
      service.deleteTaskById = jest
        .fn()
        .mockReturnValue(of({ data: taskItemsMock[0] }));
      actions$ = of(action);
      const result = await firstValueFrom(effects.deleteTask$);
      expect(result).toEqual(
        TaskActions.deleteTask.success({ task: taskItemsMock[0] })
      );
    });
    it('should dispatch deleteTask.error on error', async () => {
      service.deleteTaskById = jest
        .fn()
        .mockReturnValue(throwError(() => mockError));
      actions$ = of(action);
      const result = await firstValueFrom(effects.deleteTask$);
      expect(result).toEqual(
        TaskActions.deleteTask.error({ error: mockError.message })
      );
    });
  });
  describe('triggerFilterTasks$', () => {
    const mockFilter: RawFilterQuery<Task> = {
      status: { eq: TaskStatus.DONE },
    };
    const mockSort: SortQuery<Task> = { endDate: 'asc' };
    const action = TaskActions.filterTask.set({ options: mockFilter });
    it('should dispatch filterTask.request with filter and sort when both exist', async () => {
      store.overrideSelector(selectSortQuery, mockSort);
      store.overrideSelector(selectFilterQuery, mockFilter);
      actions$ = of(action);
      const result = await firstValueFrom(effects.triggerFilterTasks$);

      expect(result).toEqual(
        TaskActions.filterTask.request({
          query: { filter: mockFilter, sort: [mockSort] },
        })
      );
    });
    it('should dispatch filterTask.request with only filter when sort is null', async () => {
      store.overrideSelector(selectFilterQuery, mockFilter);
      store.overrideSelector(selectSortQuery, null); // simulate missing sort

      actions$ = of(action);

      const result = await firstValueFrom(effects.triggerFilterTasks$);

      expect(result).toEqual(
        TaskActions.filterTask.request({
          query: { filter: mockFilter },
        })
      );
    });
    it('should not dispatch anything when filter is null', async () => {
      store.overrideSelector(selectFilterQuery, null);
      store.overrideSelector(selectSortQuery, mockSort);

      actions$ = of(action);

      let emitted = false;
      effects.triggerFilterTasks$.subscribe(() => {
        emitted = true;
      });

      // Wait a short time to see if anything emits
      await new Promise((res) => setTimeout(res, 20));
      expect(emitted).toBe(false);
    });
  });
  describe('filterTask$', () => {
    const mockFilter: RawFilterQuery<Task> = {
      status: { eq: TaskStatus.DONE },
    };
    const action = TaskActions.filterTask.request({
      query: { filter: mockFilter },
    });
    it('should dispatch filterTask.success on success', async () => {
      service.queryTask = jest
        .fn()
        .mockReturnValue(of({ data: taskItemsMock }));
      actions$ = of(action);
      const result = await firstValueFrom(effects.filterTask$);
      expect(result).toEqual(
        TaskActions.filterTask.success({ tasks: taskItemsMock })
      );
    });
    it('should dispatch filterTask.error on error', async () => {
      service.queryTask = jest
        .fn()
        .mockReturnValue(throwError(() => mockError));
      actions$ = of(action);
      const result = await firstValueFrom(effects.filterTask$);
      expect(result).toEqual(
        TaskActions.filterTask.error({ error: mockError.message })
      );
    });
  });
  describe('triggerSortTask$', () => {
    const mockFilter: RawFilterQuery<Task> = {
      status: { eq: TaskStatus.DONE },
    };
    const mockSort: SortQuery<Task> = { endDate: 'asc' };
    const action = TaskActions.sortTask.set({ options: mockSort });
    it('should dispatch sortTask.request with filter and sort when both exist', async () => {
      store.overrideSelector(selectSortQuery, mockSort);
      store.overrideSelector(selectFilterQuery, mockFilter);
      actions$ = of(action);
      const result = await firstValueFrom(effects.triggerSortTask$);

      expect(result).toEqual(
        TaskActions.sortTask.request({
          query: { filter: mockFilter, sort: [mockSort] },
        })
      );
    });
    it('should dispatch sortTask.request with only sort when filter is null', async () => {
      store.overrideSelector(selectFilterQuery, mockFilter);
      store.overrideSelector(selectSortQuery, null); // simulate missing sort

      actions$ = of(action);

      const result = await firstValueFrom(effects.triggerSortTask$);

      expect(result).toEqual(
        TaskActions.sortTask.request({
          query: { filter: mockFilter },
        })
      );
    });
    it('should not dispatch anything when sort is null', async () => {
      store.overrideSelector(selectFilterQuery, mockFilter);
      store.overrideSelector(selectSortQuery, null);

      actions$ = of(action);

      const result = await firstValueFrom(effects.triggerSortTask$);

      expect(result).toEqual(
        TaskActions.sortTask.request({
          query: {
            filter: mockFilter,
          },
        })
      );
    });
  });
  describe('sortTask$', () => {
    const mockSort: SortQuery<Task> = { endDate: 'asc' };
    const action = TaskActions.sortTask.request({
      query: { sort: [mockSort] },
    });
    it('should dispatch sortTask.success on success', async () => {
      service.queryTask = jest
        .fn()
        .mockReturnValue(of({ data: taskItemsMock }));
      actions$ = of(action);
      const result = await firstValueFrom(effects.sortTask$);
      expect(result).toEqual(
        TaskActions.sortTask.success({ tasks: taskItemsMock })
      );
    });
    it('should dispatch sortTask.error on error', async () => {
      service.queryTask = jest
        .fn()
        .mockReturnValue(throwError(() => mockError));
      actions$ = of(action);
      const result = await firstValueFrom(effects.sortTask$);
      expect(result).toEqual(
        TaskActions.sortTask.error({ error: mockError.message })
      );
    });
  });
  describe('triggerSearchTask$', () => {
    const mockSearch: SearchQuery<Task> = { title: 'deadline' };
    const action = TaskActions.searchTask.set({ option: mockSearch });
    it('should dispatch searchTask.request with search when search state exists', async () => {
      store.overrideSelector(selectSearchQuery, mockSearch);
      actions$ = of(action);

      const result = await firstValueFrom(effects.triggerSearchTask$);

      expect(result).toEqual(
        TaskActions.searchTask.request({
          query: { search: { title: 'deadline' } },
        })
      );
    });
    it('should dispatch searchTask.request with empty query when search state is null', async () => {
      store.overrideSelector(selectSearchQuery, null);
      actions$ = of(action);

      const result = await firstValueFrom(effects.triggerSearchTask$);

      expect(result).toEqual(TaskActions.searchTask.request({ query: {} }));
    });
  });
  describe('searchTask$', () => {
    const mockSearch: SearchQuery<Task> = { title: 'deadline' };
    const action = TaskActions.searchTask.request({
      query: { search: mockSearch },
    });
    it('should dispatch searchTask.success on success', async () => {
      service.queryTask = jest
        .fn()
        .mockReturnValue(of({ data: taskItemsMock }));
      actions$ = of(action);
      const result = await firstValueFrom(effects.searchTask$);
      expect(result).toEqual(
        TaskActions.searchTask.success({ tasks: taskItemsMock })
      );
    });
    it('should dispatch searchTask.error on error', async () => {
      service.queryTask = jest
        .fn()
        .mockReturnValue(throwError(() => mockError));
      actions$ = of(action);
      const result = await firstValueFrom(effects.searchTask$);
      expect(result).toEqual(
        TaskActions.searchTask.error({ error: mockError.message })
      );
    });
  });
  describe('navigate$', () => {
    it('should not dispatch', () => {
      expect(metadata.successNotification$).toEqual(
        expect.objectContaining({ dispatch: false })
      );
    });
    it('should navigate to home page', () => {
      const action = TaskActions.createTask.success({
        task: taskItemsMock[0],
      });
      actions$ = of(action);
      effects.navigate$.subscribe(() => {
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });
  describe('errorNotification$', () => {
    it('should not dispatch', () => {
      expect(metadata.successNotification$).toEqual(
        expect.objectContaining({ dispatch: false })
      );
    });
    it('should call notification service', () => {
      const action = TaskActions.deleteTask.error({
        error: 'Mock Error Message',
      });
      actions$ = of(action);
      effects.deleteTask$.subscribe(() => {
        expect(notificationService.showNotification).toHaveBeenCalledWith(
          NotificationVariants.NOTIFICATION,
          {
            type: 'error',
            message: `${action.error}`,
          }
        );
      });
    });
  });
  describe('successNotification$', () => {
    it('should not dispatch', () => {
      expect(metadata.successNotification$).toEqual(
        expect.objectContaining({ dispatch: false })
      );
    });
    it('should call notification service', () => {
      const action = TaskActions.deleteTask.success({ task: taskItemsMock[0] });
      actions$ = of(action);
      effects.deleteTask$.subscribe(() => {
        expect(notificationService.showNotification).toHaveBeenCalledWith(
          NotificationVariants.NOTIFICATION,
          {
            type: 'success',
            title: `${action.type.split(' ')[0].split('/').join(' ')} Success`,
            message: `${action.task.title}`,
          }
        );
      });
    });
  });
});
