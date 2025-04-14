import { props, createActionGroup, emptyProps, createAction } from '@ngrx/store';
import { Task } from '../../models/task.model';

export const TaskActions = {
    loadTasks: createActionGroup({
        source: 'Tasks/Load',
        events: {
            request: emptyProps(), // No props needed for request
            success: props<{ tasks: Task[] }>(),
            error: props<{ error: string }>(),
        },
    }),
    loadTaskByID: createActionGroup({
        source: 'Tasks/LoadByID',
        events: {
            request: props<{ taskID: Pick<Task, '_id'> }>(),
            success: props<{ task: Task }>(),
            error: props<{ error: string }>(),
        },
    }),
    loadTasksByUserID: createActionGroup({
        source: 'Tasks/LoadByUserID',
        events: {
            request: props<{ userID: Pick<Task, 'creator'> }>(),
            success: props<{ tasks: Task[] }>(),
            error: props<{ error: string }>(),
        },
    }),
    createTask: createActionGroup({
        source: 'Tasks/Create',
        events: {
            request: props<{ task: Omit<Task, '_id'> }>(),
            success: props<{ task: Task }>(),
            error: props<{ error: string }>(),
        },
    }),
    updateTask: createActionGroup({
        source: 'Tasks/Update',
        events: {
            request: props<{ task: Task }>(),
            success: props<{ task: Task }>(),
            error: props<{ error: string }>(),
        },
    }),
    deleteTask: createActionGroup({
        source: 'Tasks/Delete',
        events: {
            request: props<{ id: Pick<Task, '_id'> }>(),
            success: props<{ task: Task }>(),
            error: props<{ error: string }>(),
        },
    }),
    resetSelectedTasks: createAction('Tasks/ResetSelectedTask'),
    setQueryString: createAction('Tasks/SetQueryString', props<{ query: any }>()),
};
