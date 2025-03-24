import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { TodoFormComponent } from '../../todos/components/todo-form/todo-form.component';

@Injectable({
    providedIn: 'root',
})
export class CanLeaveEditGuardService implements CanDeactivate<TodoFormComponent> {
    canDeactivate(
        component: TodoFormComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot,
    ): MaybeAsync<GuardResult> {
        if (component.todoForm.dirty || component.todoForm.touched) {
            const r = confirm('Do you want to leave Editing') && (component.todoForm.dirty || component.todoForm.touched);
            return r;
        }
        return true;
    }
}
