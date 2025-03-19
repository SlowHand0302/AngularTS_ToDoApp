import { Component, input } from '@angular/core';
import { TodoSkeletonVariants } from '../../../shared/constants/varianst.enum';

@Component({
    selector: 'app-todo-skeletons',
    imports: [],
    templateUrl: './todo-skeletons.component.html',
    styleUrl: './todo-skeletons.component.scss',
})
export class TodoSkeletonsComponent {
    readonly variants = TodoSkeletonVariants;
    numSkeletons = Array.from({ length: 5 }, (_, i) => i);
    variant = input.required<TodoSkeletonVariants>();
}
