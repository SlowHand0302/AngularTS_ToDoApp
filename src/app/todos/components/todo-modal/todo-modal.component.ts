import { Component, effect, EventEmitter, input, Input, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../shared/models/todo.model';

@Component({
    selector: 'app-todo-modal',
    standalone: true,
    imports: [SharedModule, TodoFormComponent, CommonModule],
    templateUrl: './todo-modal.component.html',
    styleUrl: './todo-modal.component.scss',
})
export class TodoModalComponent {
    modalState = input.required<boolean>();
    @Input() selectedTodo: Todo | null = null;
    @Output() triggerCloseModal = new EventEmitter<Event>();
    
    constructor() {
        effect(() => {
            console.log(this.selectedTodo);
        });
    }
}
