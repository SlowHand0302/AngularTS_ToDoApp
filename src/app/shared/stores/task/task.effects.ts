import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';
import { Router } from '@angular/router';
import { TaskService } from '../../API/services/task.service';
import { TaskActions } from './task.actions';
import { NotificationService } from '../../services/notification.service';
import { NotificationVariants } from '../../services/notification.service';
import { Store } from '@ngrx/store';
import { TaskState } from './task.reducers';
import { selectQueryString } from './task.selectors';
@Injectable()
export class TaskEffects {
    private actions$ = inject(Actions);
    private taskService = inject(TaskService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);
    private store = inject(Store<{ task: TaskState }>);

    loadTasks$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TaskActions.loadTasks.request),
            exhaustMap(() => {
                return this.taskService.loadAllTasks().pipe(
                    map((res) => {
                        console.log(res);
                        return TaskActions.loadTasks.success({ tasks: res.data });
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
                    map((res) => TaskActions.loadTaskByID.success({ task: res.data })),
                    catchError((error) => {
                        return of(TaskActions.loadTaskByID.error({ error: error.error.message }));
                    }),
                );
            }),
        );
    });

    loadTasksByUserID$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(TaskActions.loadTasksByUserID.request),
            exhaustMap(({ userID }) =>
                this.taskService.loadTaskByUserId(userID).pipe(
                    map((res) => TaskActions.loadTasksByUserID.success({ tasks: res.data })),
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
                    map((res) => TaskActions.createTask.success({ task: res.data })),
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
                    map((res) => TaskActions.updateTask.success({ task: res.data })),
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
                    map((res) => TaskActions.deleteTask.success({ task: res.data })),
                    catchError((error) => of(TaskActions.deleteTask.error({ error: error.message }))),
                );
            }),
        );
    });

    successNotification$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(TaskActions.updateTask.success, TaskActions.createTask.success, TaskActions.deleteTask.success),
                tap((action) => {
                    this.notificationService.showNotification(NotificationVariants.NOTIFICATION, {
                        type: 'success',
                        title: `${action.type.split(' ')[0].split('/').join(' ')} Success`,
                        message: `${action.task.title}`,
                    });
                }),
            ),
        { dispatch: false },
    );

    errorNotification$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(
                    TaskActions.createTask.error,
                    TaskActions.updateTask.error,
                    TaskActions.deleteTask.error,
                    TaskActions.loadTaskByID.error,
                ),
                tap((action) => {
                    this.notificationService.showNotification(NotificationVariants.NOTIFICATION, {
                        type: 'error',
                        title: `${action.error}`,
                    });
                }),
            ),
        { dispatch: false },
    );

    navigate$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(TaskActions.createTask.success, TaskActions.updateTask.success, TaskActions.loadTaskByID.error),
                tap((action) => this.router.navigate(['/'])),
            ),
        { dispatch: false },
    );
}
