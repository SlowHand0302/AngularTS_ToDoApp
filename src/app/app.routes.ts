import { Routes } from '@angular/router';
import { TodoFormComponent } from './todos/components/todo-form/todo-form.component';
import { TodosComponent } from './todos/todos.component';
import { TodoDetailComponent } from './todos/components/todo-detail/todo-detail.component';
import { SigninComponent } from './auth/signin/signin.component';

export const routes: Routes = [
    {
        path: '',
        component: TodosComponent,
        children: [
            {
                path: 'add',
                component: TodoFormComponent,
            },
            {
                path: 'edit/:id',
                component: TodoFormComponent,
            },
            {
                path: 'details/:id',
                component: TodoDetailComponent,
            },
        ],
    },
    {
        path: 'login',
        component: SigninComponent,
    },
];
