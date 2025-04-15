import { createReducer, on } from '@ngrx/store';
import { TaskActions } from './task.actions';
import { Task } from '../../models/task.model';
import { removeLoadingState, addLoadingState } from '../../utils/handleLoadingStateReducer.utils';
export interface TaskState {
    tasks: Task[];
    selectedTask: Task | null;
    loading: Set<string>;
    error: string | null;
    queryString: string | null;
}

const initialState: TaskState = {
    tasks: [],
    selectedTask: null,
    loading: new Set<string>(),
    error: null,
    queryString: null,
};

export const taskReducer = createReducer<TaskState>(
    initialState,
    on(TaskActions.resetSelectedTasks, (state) => ({
        ...state,
        selectedTask: null,
    })),
    
    on(TaskActions.setQueryString, (state, { query }) => {
        return {
            ...state,
            queryString: query,
        };
    }),

    on(TaskActions.loadTasks.request, (state) => addLoadingState(state, 'loadTasks')),
    on(TaskActions.loadTasks.success, (state, { tasks }) => removeLoadingState({ ...state, tasks }, 'loadTasks')),
    on(TaskActions.loadTasks.error, (state, { error }) => removeLoadingState({ ...state, error }, 'loadTasks')),

    on(TaskActions.loadTaskByID.request, (state) => addLoadingState(state, 'loadTaskByID')),
    on(TaskActions.loadTaskByID.success, (state, { task }) =>
        removeLoadingState({ ...state, selectedTask: task }, 'loadTaskByID'),
    ),
    on(TaskActions.loadTaskByID.error, (state, { error }) => removeLoadingState({ ...state, error }, 'loadTaskByID')),

    on(TaskActions.loadTasksByUserID.request, (state) => addLoadingState(state, 'loadTasksByUserID')),
    on(TaskActions.loadTasksByUserID.success, (state, { tasks }) =>
        removeLoadingState({ ...state, tasks }, 'loadTasksByUserID'),
    ),
    on(TaskActions.loadTasksByUserID.error, (state, { error }) =>
        removeLoadingState({ ...state, error }, 'loadTasksByUserID'),
    ),

    on(TaskActions.createTask.request, (state) => addLoadingState(state, 'createTask')),
    on(TaskActions.createTask.success, (state, { task }) =>
        removeLoadingState({ ...state, tasks: [...state.tasks, task] }, 'createTask'),
    ),
    on(TaskActions.createTask.error, (state, { error }) => removeLoadingState({ ...state, error }, 'createTask')),

    on(TaskActions.updateTask.request, (state) => addLoadingState(state, 'updateTask')),
    on(TaskActions.updateTask.success, (state, { task }) =>
        removeLoadingState(
            { ...state, tasks: [...state.tasks.map((item) => (item._id === task._id ? task : item))] },
            'updateTask',
        ),
    ),
    on(TaskActions.updateTask.error, (state, { error }) => removeLoadingState({ ...state, error }, 'updateTask')),

    on(TaskActions.deleteTask.request, (state) => addLoadingState(state, 'deleteTask')),
    on(TaskActions.deleteTask.success, (state, { task }) =>
        removeLoadingState({ ...state, tasks: [...state.tasks.filter((item) => item._id !== task._id)] }, 'deleteTask'),
    ),
    on(TaskActions.deleteTask.error, (state, { error }) => removeLoadingState({ ...state, error }, 'deleteTask')),
);
