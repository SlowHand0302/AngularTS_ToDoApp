import { taskItemsMock } from '../../mockups/testTaskItems.mockup';
import { TaskState } from './task.reducers';
import {
  selectChosenTask,
  selectError,
  selectFilterQuery,
  selectLoading,
  selectSearchQuery,
  selectSortQuery,
  selectTasks,
} from './task.selectors';
import { TaskType } from '../../constants/variants.enum';

describe('Task Selectors', () => {
  const initialState: TaskState = {
    tasks: [...taskItemsMock],
    selectedTask: taskItemsMock[0],
    loading: new Set<string>(['Mock Loading']),
    error: 'Mock Errors',
    sort: { title: 'asc' },
    filter: { type: { eq: TaskType.DOC } },
    search: { title: 'Mock Search' },
  };

  it('should select the task list', () => {
    const result = selectTasks.projector(initialState);
    expect(result.length).toBe(taskItemsMock.length);
    expect(result[0]._id).toBe(taskItemsMock[0]._id);
  });

  it('should select the chosen task', () => {
    const result = selectChosenTask.projector(initialState);
    expect(result).not.toBeNull();
    expect(result?._id).toBe(taskItemsMock[0]._id);
  });

  it('should select the loading state', () => {
    const result = selectLoading.projector(initialState);
    expect(result.size).not.toBe(0);
    expect(result.has('Mock Loading')).toBeTruthy();
  });

  it('should select the error', () => {
    const result = selectError.projector(initialState);
    expect(result).not.toBeNull();
    expect(result).toBe(initialState.error);
  });

  it('should select the sort', () => {
    const result = selectSortQuery.projector(initialState);
    expect(result).not.toBeNull();
    expect(result?.title).toBe('asc');
  });

  it('should select the filter', () => {
    const result = selectFilterQuery.projector(initialState);
    expect(result).not.toBeNull();
    expect(result?.type).not.toBeUndefined();
    expect(result?.type?.eq).toBe(TaskType.DOC);
  });

  it('should select the search', () => {
    const result = selectSearchQuery.projector(initialState);
    expect(result).not.toBeNull();
    expect(result?.title).toBe(initialState.search?.title);
  });
});
