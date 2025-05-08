import * as lodash from 'lodash';
import * as fromReducer from './task.reducers';
import { TaskActions } from './task.actions';
import { taskItemsMock } from '../../mockups/testTaskItems.mockup';
import {
  TaskType,
  TaskPriority,
  TaskStatus,
} from '../../constants/variants.enum';
import { RawFilterQuery } from '@app/shared/API/models/FilterQuery.type';
import { SortQuery } from '@app/shared/API/models/SortQuery.type';
import { Task } from '@app/shared/models/task.model';
import { SearchQuery } from '@app/shared/API/models/SearchQuery.type';
describe('TaskReducer', () => {
  const initialState: fromReducer.TaskState = {
    tasks: [],
    selectedTask: null,
    loading: new Set<string>(['']),
    error: null,
    sort: null,
    filter: null,
    search: null,
  };
  describe('Tasks/Load', () => {
    it('should request to load tasks', () => {
      const action = TaskActions.loadTasks.request();
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading).not.toBeNull();
      expect(state.loading.has('loadTasks')).toBeTruthy();
    });
    it('should handle load tasks success', () => {
      const action = TaskActions.loadTasks.success({ tasks: taskItemsMock });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('loadTasks')).toBeFalsy();
      expect(state.tasks.length).toBe(taskItemsMock.length);
    });
    it('should handle load tasks error', () => {
      const action = TaskActions.loadTasks.error({ error: 'Mock Error' });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('loadTasks')).toBeFalsy();
      expect(state.error).not.toBeNull();
      expect(state.error).toBe('Mock Error');
    });
  });

  describe('Tasks/LoadByID', () => {
    it('should request to load task by id', () => {
      const action = TaskActions.loadTaskByID.request({ taskID: { _id: '1' } });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading).not.toBeNull();
      expect(state.loading.has('loadTaskByID')).toBeTruthy();
    });
    it('should handle load task by id success', () => {
      const action = TaskActions.loadTaskByID.success({
        task: taskItemsMock[0],
      });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('loadTaskByID')).toBeFalsy();
      expect(state.tasks.length).not.toBeNull();
    });
    it('should handle load task by id error', () => {
      const action = TaskActions.loadTaskByID.error({ error: 'Mock Error' });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('loadTaskByID')).toBeFalsy();
      expect(state.error).not.toBeNull();
      expect(state.error).toBe('Mock Error');
    });
  });

  describe('Tasks/LoadByUserID', () => {
    it('should request to load tasks by user id', () => {
      const action = TaskActions.loadTasksByUserID.request({
        userID: { creator: '1' },
      });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading).not.toBeNull();
      expect(state.loading.has('loadTasksByUserID')).toBeTruthy();
    });
    it('should handle load tasks by user id success', () => {
      const action = TaskActions.loadTasksByUserID.success({
        tasks: taskItemsMock,
      });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('loadTasksByUserID')).toBeFalsy();
      expect(state.tasks.length).not.toBeNull();
    });
    it('should handle load tasks by user id error', () => {
      const action = TaskActions.loadTasksByUserID.error({
        error: 'Mock Error',
      });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('loadTasksByUserID')).toBeFalsy();
      expect(state.error).not.toBeNull();
      expect(state.error).toBe('Mock Error');
    });
  });

  describe('Tasks/Create', () => {
    const mockNewTask = {
      creator: 'User 1',
      assignee: 'User 1',
      title: 'New Task',
      details: 'New Task',
      startDate: new Date('2025-03-08'),
      endDate: new Date('2025-03-08'),
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      type: TaskType.DOC,
    };
    it('should request to create task', () => {
      const action = TaskActions.createTask.request({
        task: mockNewTask,
      });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading).not.toBeNull();
      expect(state.loading.has('createTask')).toBeTruthy();
    });
    it('should handle create task success', () => {
      const action = TaskActions.createTask.success({
        task: { ...mockNewTask, _id: `${taskItemsMock.length + 1}` },
      });
      const state = fromReducer.taskReducer(
        {
          ...initialState,
          tasks: [
            ...taskItemsMock,
            { ...mockNewTask, _id: `${taskItemsMock.length + 1}` },
          ],
        },
        action
      );
      expect(state.loading.has('createTask')).toBeFalsy();
      expect(state.tasks.length).not.toBeNull();
      expect(state.tasks[state.tasks.length - 1]._id).toBe(
        `${taskItemsMock.length + 1}`
      );
    });
    it('should handle create task error', () => {
      const action = TaskActions.createTask.error({ error: 'Mock Error' });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('createTask')).toBeFalsy();
      expect(state.error).not.toBeNull();
      expect(state.error).toBe('Mock Error');
    });
  });

  describe('Tasks/Update', () => {
    const mockUpdatedTask = {
      _id: '1',
      creator: 'User 1',
      assignee: 'User 1',
      title: 'Updated Task',
      details: 'Updated Task',
      startDate: new Date('2025-03-08'),
      endDate: new Date('2025-03-08'),
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      type: TaskType.DOC,
    };
    it('should request to update task', () => {
      const action = TaskActions.updateTask.request({
        task: mockUpdatedTask,
      });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading).not.toBeNull();
      expect(state.loading.has('updateTask')).toBeTruthy();
    });
    it('should handle update task success', () => {
      const action = TaskActions.updateTask.success({
        task: mockUpdatedTask,
      });
      const state = fromReducer.taskReducer(
        {
          ...initialState,
          tasks: [mockUpdatedTask],
        },
        action
      );
      expect(state.loading.has('updateTask')).toBeFalsy();
      expect(state.tasks.length).not.toBeNull();
      expect(state.tasks[state.tasks.length - 1]._id).toBe(mockUpdatedTask._id);
    });
    it('should handle update task error', () => {
      const action = TaskActions.updateTask.error({ error: 'Mock Error' });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('updateTask')).toBeFalsy();
      expect(state.error).not.toBeNull();
      expect(state.error).toBe('Mock Error');
    });
  });

  describe('Tasks/Delete', () => {
    const mockId = '1';
    it('should request to delete tasks', () => {
      const action = TaskActions.deleteTask.request({
        id: { _id: mockId },
      });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading).not.toBeNull();
      expect(state.loading.has('deleteTask')).toBeTruthy();
    });
    it('should handle delete tasks success', () => {
      const action = TaskActions.deleteTask.success({
        task: taskItemsMock[1],
      });
      const state = fromReducer.taskReducer(
        {
          ...initialState,
          tasks: [taskItemsMock[1]],
        },
        action
      );
      expect(state.loading.has('deleteTask')).toBeFalsy();
      expect(state.tasks.every((item) => item._id !== mockId)).toBe(true);
    });
    it('should handle delete tasks error', () => {
      const action = TaskActions.deleteTask.error({ error: 'Mock Error' });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('deleteTask')).toBeFalsy();
      expect(state.error).not.toBeNull();
      expect(state.error).toBe('Mock Error');
    });
  });

  describe('Tasks/Filter', () => {
    const mockFilterQuery: RawFilterQuery<Task> = {
      type: { eq: TaskType.DOC },
    };
    it('should set filter query', () => {
      const action = TaskActions.filterTask.set({ options: mockFilterQuery });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.filter).not.toBeNull();
      expect(lodash.isEqual(state.filter, mockFilterQuery)).toBe(true);
    });
    it('should request to filter tasks', () => {
      const action = TaskActions.filterTask.request({
        query: { filter: mockFilterQuery },
      });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading).not.toBeNull();
      expect(state.loading.has('filterTask')).toBeTruthy();
    });
    it('should handle filter tasks success', () => {
      const action = TaskActions.filterTask.success({
        tasks: taskItemsMock,
      });
      const state = fromReducer.taskReducer(
        { ...initialState, filter: mockFilterQuery },
        action
      );
      expect(state.loading.has('filterTask')).toBeFalsy();
      expect(state.filter).not.toBeNull();
      expect(state.tasks.length).toBe(taskItemsMock.length);
    });
    it('should handle filter tasks error', () => {
      const action = TaskActions.filterTask.error({ error: 'Mock Error' });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('filterTask')).toBeFalsy();
      expect(state.error).not.toBeNull();
      expect(state.error).toBe('Mock Error');
    });
    it('should unset filter query', () => {
      const action = TaskActions.filterTask.unset({ field: 'type' });
      const state = fromReducer.taskReducer(
        { ...initialState, filter: mockFilterQuery },
        action
      );
      expect(lodash.isEqual(state.filter, {})).toBeTruthy();
    });
  });

  describe('Tasks/Sort', () => {
    const mockSortQuery: SortQuery<Task> = {
      title: 'asc',
    };
    it('should set sort query', () => {
      const action = TaskActions.sortTask.set({ options: mockSortQuery });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.sort).not.toBeNull();
      expect(lodash.isEqual(state.sort, mockSortQuery)).toBe(true);
    });
    it('should request to sort tasks', () => {
      const action = TaskActions.sortTask.request({
        query: { sort: [mockSortQuery] },
      });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading).not.toBeNull();
      expect(state.loading.has('sortTask')).toBeTruthy();
    });
    it('should handle sort tasks success', () => {
      const action = TaskActions.sortTask.success({
        tasks: taskItemsMock,
      });
      const state = fromReducer.taskReducer(
        { ...initialState, sort: mockSortQuery },
        action
      );
      expect(state.loading.has('sortTask')).toBeFalsy();
      expect(state.sort).not.toBeNull();
      expect(state.tasks.length).toBe(taskItemsMock.length);
    });
    it('should handle sort tasks error', () => {
      const action = TaskActions.sortTask.error({ error: 'Mock Error' });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('sortTask')).toBeFalsy();
      expect(state.error).not.toBeNull();
      expect(state.error).toBe('Mock Error');
    });
    it('should unset sort query', () => {
      const action = TaskActions.sortTask.unset();
      const state = fromReducer.taskReducer(
        { ...initialState, sort: mockSortQuery },
        action
      );
      expect(state.sort).toBeNull();
    });
  });

  describe('Tasks/Search', () => {
    const mockSearchQuery: SearchQuery<Task> = {
      title: 'asc',
    };
    it('should set search query', () => {
      const action = TaskActions.searchTask.set({ option: mockSearchQuery });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.search).not.toBeNull();
      expect(lodash.isEqual(state.search, mockSearchQuery)).toBe(true);
    });
    it('should request to search tasks', () => {
      const action = TaskActions.searchTask.request({
        query: { search: mockSearchQuery },
      });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading).not.toBeNull();
      expect(state.loading.has('searchTask')).toBeTruthy();
    });
    it('should handle search tasks success', () => {
      const action = TaskActions.searchTask.success({
        tasks: taskItemsMock,
      });
      const state = fromReducer.taskReducer(
        { ...initialState, search: mockSearchQuery },
        action
      );
      expect(state.loading.has('searchTask')).toBeFalsy();
      expect(state.search).not.toBeNull();
      expect(state.tasks.length).toBe(taskItemsMock.length);
    });
    it('should handle search tasks error', () => {
      const action = TaskActions.searchTask.error({ error: 'Mock Error' });
      const state = fromReducer.taskReducer(initialState, action);
      expect(state.loading.has('searchTask')).toBeFalsy();
      expect(state.error).not.toBeNull();
      expect(state.error).toBe('Mock Error');
    });
    it('should reset search query', () => {
      const action = TaskActions.searchTask.reset();
      const state = fromReducer.taskReducer(
        { ...initialState, search: mockSearchQuery },
        action
      );
      expect(state.search).toBeNull();
    });
  });
});
