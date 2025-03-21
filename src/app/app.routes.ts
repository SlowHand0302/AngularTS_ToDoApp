import { Routes } from '@angular/router';
import { CanLeaveEditGuardService } from './shared/guards/can-leave-edit-guard.service';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./auth/signin/signin.component').then((m) => m.SigninComponent),
    },
    {
        path: '',
        loadComponent: () => import('./todos/todos.component').then((m) => m.TodosComponent),
        // canDeactivate: [AuthLoginGuard],
        children: [
            {
                path: 'add',
                loadComponent: () =>
                    import('./todos/components/todo-form/todo-form.component').then((m) => m.TodoFormComponent),
                canDeactivate: [CanLeaveEditGuardService],
            },
            {
                path: 'edit/:id',
                loadComponent: () =>
                    import('./todos/components/todo-form/todo-form.component').then((m) => m.TodoFormComponent),
                canDeactivate: [CanLeaveEditGuardService],
            },
            {
                path: 'details/:id',
                loadComponent: () =>
                    import('./todos/components/todo-detail/todo-detail.component').then((m) => m.TodoDetailComponent),
            },
        ],
    },
];
