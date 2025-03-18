import { Component, input } from '@angular/core';

@Component({
    selector: 'app-todo-skeletons',
    imports: [],
    templateUrl: './todo-skeletons.component.html',
    styleUrl: './todo-skeletons.component.scss',
})
export class TodoSkeletonsComponent {
    numSkeletons = Array.from({ length: 5 }, (_, i) => i);
    variant = input.required<'todo-item' | 'todo-form__edit' | 'todo-details'>();
}
