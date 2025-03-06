import { Component, effect, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { Todo } from '../../../shared/models/todo.model';
import { AutoResizeDirective } from '../../../shared/directives/auto-resize.directive';

@Component({
    selector: 'app-todo-form',
    imports: [SharedModule, FormsModule, AutoResizeDirective],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent implements OnChanges {
    @Input() todo: Todo | null = null;
    @Input() modalState: boolean = false;
    @Output() triggerCloseModal = new EventEmitter<Event>();
    @Output() submitForm = new EventEmitter<Todo>();

    deadline: (string | Date)[] = [];
    todoTemplate = signal<Todo>({
        id: '',
        title: '',
        deadline: '',
        state: false,
        details: '',
    });

    constructor() {
        effect(() => {
            // console.log(this.todo);
            // console.log(this.todoTemplate);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.todo) {
            this.deadline = [this.todo.deadline];
            this.todoTemplate.set(this.todo);
        } else if (!this.todo || !this.modalState) {
            this.deadline = [];
            this.handleClearForm();
        }
        // console.log('Changes:', this.todoTemplate);
    }

    onSelectDate($event: any) {
        // console.log('selectDate', $event.target.value);
        this.todoTemplate.update((prev) => (prev = { ...prev, deadline: new Date($event.target.value).toISOString() }));
    }

    onCloseButtonClick() {
        this.handleClearForm()
        this.triggerCloseModal.emit();
    }

    handleClearForm() {
        this.todoTemplate.set({
            id: '',
            title: '',
            deadline: '',
            state: false,
            details: '',
        });
    }

    onSubmit(form: NgForm) {
        console.log(form)
        console.log(this.todoTemplate())
        this.submitForm.emit({ ...this.todoTemplate(), deadline: form.value.deadline[0], id: this.todoTemplate().id });
        this.triggerCloseModal.emit();
        form.reset();
    }
}
