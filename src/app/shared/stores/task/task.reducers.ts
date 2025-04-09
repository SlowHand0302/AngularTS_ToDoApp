import { createReducer, on } from '@ngrx/store';
import { TaskActions } from './task.actions';
import { Task } from '../../models/task.model';

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: Set<string>;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: new Set<string>(),
  error: null,
};

export const taskReducer = createReducer<TaskState>(
  initialState,
  on(TaskActions.resetSelectedTasks, (state) => ({
    ...state,
    selectedTask: null,
  })),
  on(TaskActions.loadTasks.request, (state) => ({
    ...state,
    loading: new Set([...state.loading, 'loadTasks']),
  })),
  on(TaskActions.loadTasks.success, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: new Set([
      ...Array.from(state.loading).filter((item) => item !== 'loadTasks'),
    ]),
  })),
  on(TaskActions.loadTasks.error, (state, { error }) => ({
    ...state,
    error,
    loading: new Set([
      ...Array.from(state.loading).filter((item) => item !== 'loadTasks'),
    ]),
  })),

  on(TaskActions.loadTaskByID.request, (state) => ({
    ...state,
    loading: new Set([...state.loading, 'loadTaskByID']),
  })),
  on(TaskActions.loadTaskByID.success, (state, { task }) => ({
    ...state,
    selectedTask: task,
    loading: new Set([
      ...Array.from(state.loading).filter((item) => item !== 'loadTaskByID'),
    ]),
  })),
  on(TaskActions.loadTaskByID.error, (state, { error }) => ({
    ...state,
    error,
    loading: new Set([
      ...Array.from(state.loading).filter((item) => item !== 'loadTaskByID'),
    ]),
  })),

  on(TaskActions.loadTasksByUserID.request, (state) => ({
    ...state,
    loading: new Set([...state.loading, 'loadTasksByUserID']),
  })),
  on(TaskActions.loadTasksByUserID.success, (state, { tasks }) => ({
    ...state,
    tasks,
    loading: new Set([
      ...Array.from(state.loading).filter(
        (item) => item !== 'loadTasksByUserID'
      ),
    ]),
  })),
  on(TaskActions.loadTasksByUserID.error, (state, { error }) => ({
    ...state,
    error,
    loading: new Set([
      ...Array.from(state.loading).filter(
        (item) => item !== 'loadTasksByUserID'
      ),
    ]),
  })),

  on(TaskActions.createTask.request, (state) => ({
    ...state,
    loading: new Set([...state.loading, 'createTask']),
  })),
  on(TaskActions.createTask.success, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    loading: new Set([
      ...Array.from(state.loading).filter((item) => item !== 'createTask'),
    ]),
  })),
  on(TaskActions.createTask.error, (state, { error }) => ({
    ...state,
    error,
    loading: new Set([
      ...Array.from(state.loading).filter((item) => item !== 'createTask'),
    ]),
  })),

  on(TaskActions.updateTask.request, (state) => ({
    ...state,
    loading: new Set([...state.loading, 'updateTask']),
  })),
  on(TaskActions.updateTask.success, (state, { task }) => ({
    ...state,
    tasks: [
      ...state.tasks.map((item) => (item._id === task._id ? task : item)),
    ],
    loading: new Set([
      ...Array.from(state.loading).filter((item) => item !== 'updateTask'),
    ]),
  })),
  on(TaskActions.updateTask.error, (state, { error }) => ({
    ...state,
    error,
    loading: new Set([
      ...Array.from(state.loading).filter((item) => item !== 'updateTask'),
    ]),
  })),

  on(TaskActions.deleteTask.request, (state) => ({
    ...state,
    loading: new Set([...state.loading, 'deleteTask']),
  })),
  on(TaskActions.deleteTask.success, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks.filter((item) => item._id !== task._id)],
    loading: new Set([
      ...Array.from(state.loading).filter((item) => item !== 'deleteTask'),
    ]),
  })),
  on(TaskActions.deleteTask.error, (state, { error }) => ({
    ...state,
    error,
    loading: new Set([
      ...Array.from(state.loading).filter((item) => item !== 'deleteTask'),
    ]),
  }))
);
