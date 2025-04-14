// task.reducer.ts
import { createSelector } from '@ngrx/store';
import { TaskState } from './task.reducers';

// Feature selector
export const selectTaskState = (state: { task: TaskState }) => state.task;

// Specific selector for each states
export const selectTasks = createSelector(selectTaskState, (state: TaskState) => state.tasks);
export const selectLoading = createSelector(selectTaskState, (state: TaskState) => state.loading);
export const selectError = createSelector(selectTaskState, (state: TaskState) => state.error);
export const selectChosenTask = createSelector(selectTaskState, (state: TaskState) => state.selectedTask);
export const selectQueryString = createSelector(selectTaskState, (state: TaskState) => state.queryString);
