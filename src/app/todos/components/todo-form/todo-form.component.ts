import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AutoResizeDirective } from '../../../shared/directives/auto-resize.directive';
import { noWhitespaceValidator } from '../../../shared/validators/no-whitespace.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { TodoSkeletonsComponent } from '../todo-skeletons/todo-skeletons.component';
import { Todo } from '../../../shared/models/todo.model';
@Component({
    selector: 'app-todo-form',
    imports: [SharedModule, AutoResizeDirective, TodoSkeletonsComponent],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
    private readonly aRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    isLoading = signal<boolean>(false);
    isFirstLoad = signal<boolean>(true);

    todoForm!: FormGroup;
    constructor(private fb: FormBuilder, private todoService: TodoService) {
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
        this.todoService.loadingTodos$.subscribe((state) => {
            this.isLoading.set(state);
        });
    }

    onCloseButtonClick() {
        this.handleResetForm();
        this.router.navigate(['/']);
    }

    onSubmit() {
        if (this.todoForm.value['id']) {
            this.todoService
                .APIEmulator(() => this.todoService.editTodo(this.todoForm.value))
                .subscribe(() => {
                    this.router.navigate(['/']);
                    this.handleResetForm();
                });
        } else {
            this.todoService
                .APIEmulator(() => this.todoService.addTodo(this.todoForm.value))
                .subscribe(() => {
                    this.router.navigate(['/']);
                    this.handleResetForm();
                });
        }
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
        this.todoService
            .APIEmulator<Todo | null>(() => this.todoService.findTodoById(id))
            .subscribe((result) => {
                if (result) {
                    this.todoForm.patchValue({ ...result });
                    this.isFirstLoad.set(false);
                }
            });
    }
}
