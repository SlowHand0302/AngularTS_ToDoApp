import { Component, inject, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AutoResizeDirective } from '../../../shared/directives/auto-resize.directive';
import { noWhitespaceValidator } from '../../../shared/validators/no-whitespace.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { TodosComponent } from '../../todos.component';

@Component({
    selector: 'app-todo-form',
    imports: [SharedModule, FormsModule, AutoResizeDirective, ReactiveFormsModule],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
    private readonly aRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly todosComponent = inject(TodosComponent);

    todoForm!: FormGroup;
    constructor(private fb: FormBuilder) {
        this.todoForm = this.fb.group({
            id: '',
            title: ['', Validators.compose([Validators.required, Validators.minLength(6), noWhitespaceValidator()])],
            deadline: [[], Validators.compose([Validators.required])],
            details: ['', Validators.compose([Validators.required, Validators.minLength(6), noWhitespaceValidator()])],
            isCompleted: false,
        });
    }

    ngOnInit() {
        this.aRoute.paramMap.subscribe((params) => {
            const id = params.get('id'); // Get the 'id' from the URL
            if (id) {
                this.fetchTodoById(+id); // Convert string to number
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {}

    onCloseButtonClick() {
        this.handleResetForm();
        this.router.navigate(['/']);
    }

    onSubmit() {
        if (this.todoForm.value['id']) {
            this.todosComponent.handleEditTodo(this.todoForm.value);
        } else {
            this.todosComponent.handleAddTodo(this.todoForm.value);
        }
        this.handleResetForm()
        this.router.navigate(['/']);
    }

    handleResetForm() {
        this.todoForm.reset({
            title: '',
            deadline: [],
            isCompleted: false,
            details: '',
        });
    }

    fetchTodoById(id: number | string) {
        const fetched = this.todosComponent.todos().find((item) => item.id === id);
        if (fetched) {
            this.todoForm.patchValue({ ...fetched });
        }
    }
}
