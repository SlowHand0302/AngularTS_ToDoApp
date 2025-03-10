import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { Todo } from '../../../shared/models/todo.model';
import { AutoResizeDirective } from '../../../shared/directives/auto-resize.directive';
import { noWhitespaceValidator } from '../../../shared/validators/no-whitespace.validator';

@Component({
    selector: 'app-todo-form',
    imports: [SharedModule, FormsModule, AutoResizeDirective, ReactiveFormsModule],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
    @Input() todo: Todo | null = null;
    @Input() modalState: boolean = false;
    @Output() triggerCloseModal = new EventEmitter<Event>();
    @Output() submitForm = new EventEmitter<Todo>();

    todoForm!: FormGroup;
    constructor(private fb: FormBuilder) {}
    ngOnInit() {
        this.todoForm = this.fb.group({
            id: '',
            title: ['', Validators.compose([Validators.required, Validators.minLength(6), noWhitespaceValidator()])],
            deadline: [[], Validators.compose([Validators.required])],
            details: ['', Validators.compose([Validators.required, Validators.minLength(6), noWhitespaceValidator()])],
            isCompleted: false,
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.todo) {
            this.todoForm.patchValue({ ...this.todo });
        }
        if (!this.modalState && this.todoForm) {
            this.handleResetForm();
        }
    }

    onCloseButtonClick() {
        this.triggerCloseModal.emit();
        this.handleResetForm();
    }

    onSubmit() {
        console.log(this.todoForm);
        this.submitForm.emit(this.todoForm.value);
        this.triggerCloseModal.emit();
    }

    handleResetForm() {
        this.todoForm.reset({
            title: '',
            deadline: [],
            isCompleted: false,
            details: '',
        });
    }
}
