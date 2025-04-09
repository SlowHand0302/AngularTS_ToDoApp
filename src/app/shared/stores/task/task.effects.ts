import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { TaskService } from '../../API/task.service';
import { TaskActions } from './task.actions';

@Injectable()
export class TaskEffects {
    private actions$ = inject(Actions);
    private taskService = inject(TaskService);

    loadTasks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TaskActions.loadTasks.request),
            exhaustMap(() => {
                return this.taskService.loadAllTasks().pipe(
                    map((res) => {
                        return TaskActions.loadTasks.success({ tasks: res.metadata });
                    }),
                    catchError((error) => of(TaskActions.loadTasks.error({ error: error.message }))),
                );
            }),
        );
    });

    loadTaskByID$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TaskActions.loadTaskByID.request),
            exhaustMap(({ taskID }) => {
                return this.taskService.loadTaskById(taskID).pipe(
                    map((res) => TaskActions.loadTaskByID.success({ task: res.metadata })),
                    catchError((error) => of(TaskActions.loadTaskByID.error({ error: error.message }))),
                );
            }),
        );
    });

    loadTasksByUserID$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TaskActions.loadTasksByUserID.request),
            exhaustMap(({ userID }) =>
                this.taskService.loadTaskByUserId(userID).pipe(
                    map((res) => TaskActions.loadTasksByUserID.success({ tasks: res.metadata })),
                    catchError((error) => of(TaskActions.loadTasksByUserID.error({ error: error.message }))),
                ),
            ),
        );
    });

    createTask$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TaskActions.createTask.request),
            exhaustMap(({ task }) => {
                return this.taskService.createTask(task).pipe(
                    map((res) => TaskActions.createTask.success({ task: res.metadata })),
                    catchError((error) => of(TaskActions.createTask.error({ error: error.message }))),
                );
            }),
        );
    });

    updateTask$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TaskActions.updateTask.request),
            exhaustMap(({ task }) => {
                return this.taskService.updateTaskById(task).pipe(
                    map((res) => TaskActions.updateTask.success({ task: res.metadata })),
                    catchError((error) => of(TaskActions.updateTask.error({ error: error.message }))),
                );
            }),
        );
    });

    deleteTask$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TaskActions.deleteTask.request),
            exhaustMap(({ id }) => {
                return this.taskService.deleteTaskById(id).pipe(
                    map((res) => TaskActions.deleteTask.success({ task: res.metadata })),
                    catchError((error) => of(TaskActions.deleteTask.error({ error: error.message }))),
                );
            }),
        );
    });
}
