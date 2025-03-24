import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { TodoFormComponent } from '../../todos/components/todo-form/todo-form.component';

@Injectable({
    providedIn: 'root',
})
export class CanLeaveEditGuard implements CanDeactivate<TodoFormComponent> {
    canDeactivate(
        component: TodoFormComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot,
    ): MaybeAsync<GuardResult> {
        if (component.todoForm.dirty || component.todoForm.touched) {
            const r = window.confirm('Do you want to leave Editing');
            return r;
        }
        return true;
    }
}
