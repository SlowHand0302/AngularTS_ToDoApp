import { createReducer, on, ReducerTypes, ReducerManager } from '@ngrx/store';
import { TaskActions } from './task.actions';
import { Task } from '../../models/task.model';
import { removeLoadingState, addLoadingState } from '../../utils/handleLoadingStateReducer.utils';
import { SortQuery } from '../../API/models/SortQuery.type';
import { RawFilterQuery } from '../../API/models/FilterQuery.type';
import { SearchQuery } from '../../API/models/SearchQuery.type';
export interface TaskState {
    tasks: Task[];
    selectedTask: Task | null;
    loading: Set<string>;
    error: string | null;
    sort: SortQuery<Task> | null;
    filter: RawFilterQuery<Task> | null;
    search: SearchQuery<Task> | null;
}

const initialState: TaskState = {
    tasks: [],
    selectedTask: null,
    loading: new Set<string>(),
    error: null,
    sort: null,
    filter: null,
    search: null,
};

export const taskReducer = createReducer<TaskState>(
    initialState,
    on(TaskActions.resetSelectedTasks, (state) => ({
        ...state,
        selectedTask: null,
    })),

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

    on(TaskActions.filterTask.set, (state, { options }) => ({ ...state, filter: { ...state.filter, ...options } })),
    on(TaskActions.filterTask.request, (state) => addLoadingState(state, 'filterTask')),
    on(TaskActions.filterTask.success, (state, { tasks }) => {
        return removeLoadingState({ ...state, tasks }, 'filterTask');
    }),
    on(TaskActions.filterTask.error, (state, { error }) => removeLoadingState({ ...state, error }, 'filterTask')),
    on(TaskActions.filterTask.unset, (state, { field }) => {
        const temp = { ...state.filter };
        delete temp[field];
        console.log(temp);
        return {
            ...state,
            filter: { ...temp },
        };
    }),

    on(TaskActions.sortTask.set, (state, { options }) => ({ ...state, sort: options })),
    on(TaskActions.sortTask.request, (state) => addLoadingState(state, 'sortTask')),
    on(TaskActions.sortTask.success, (state, { tasks }) => removeLoadingState({ ...state, tasks }, 'sortTask')),
    on(TaskActions.sortTask.error, (state, { error }) => removeLoadingState({ ...state, error }, 'sortTask')),
    on(TaskActions.sortTask.unset, (state) => ({ ...state, sort: null })),

    on(TaskActions.searchTask.set, (state, { option }) => ({ ...state, search: option })),
    on(TaskActions.searchTask.request, (state) => addLoadingState(state, 'searchTask')),
    on(TaskActions.searchTask.success, (state, { tasks }) => removeLoadingState({ ...state, tasks }, 'searchTask')),
    on(TaskActions.searchTask.error, (state, { error }) => removeLoadingState({ ...state, error }, 'searchTask')),
    on(TaskActions.searchTask.reset, (state) => ({ ...state, search: null })),
);
