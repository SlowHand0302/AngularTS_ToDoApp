import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./todos/todos.component').then((m) => m.TodosComponent),
    },
];
