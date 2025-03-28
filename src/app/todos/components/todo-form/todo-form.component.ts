import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AutoResizeDirective } from '../../../shared/directives/auto-resize.directive';
import { noWhitespaceValidator } from '../../../shared/validators/no-whitespace.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { TodoSkeletonsComponent } from '../todo-skeletons/todo-skeletons.component';
import { Todo } from '../../../shared/models/todo.model';
import { TodoSkeletonVariants } from '../../../shared/constants/varianst.enum';
import { NotificationVariants, NotificationService } from '../../../shared/services/notification.service';

@Component({
    selector: 'app-todo-form',
    imports: [SharedModule, AutoResizeDirective, TodoSkeletonsComponent],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent implements OnInit {
    private readonly aRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    readonly skeletonsVariants = TodoSkeletonVariants;
    isLoading = signal<Map<string, boolean>>(new Map());
    readonly isEditingOrAdding = computed(
        () => (this.isLoading().get('edit') ?? false) || (this.isLoading().get('add') ?? false),
    );

    todoForm!: FormGroup;
    constructor(
        private fb: FormBuilder,
        private todoService: TodoService,
        private notificationService: NotificationService,
    ) {
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
            } else {
                this.handleResetForm();
            }
        });

        ['edit', 'add', 'loadById'].forEach((key) => {
            this.todoService.isLoading(key).subscribe((state) => {
                this.isLoading.update((prev) => new Map(prev).set(key, state));
            });
        });
    }

    onCloseButtonClick() {
        this.router.navigate(['/']);
    }

    onSubmit() {
        if (this.todoForm.value['id'] !== '') {
            this.todoService
                .APIEmulator(() => this.todoService.editTodo(this.todoForm.value), 'edit')
                .subscribe(() => {
                    this.notificationService.showNotification(NotificationVariants.NOTIFICATION, {
                        type: 'success',
                        title: 'Update Todo Success',
                        message: `Update ${this.todoForm.value.title} success`,
                    });
                    this.router.navigate(['/']);
                    this.handleResetForm();
                });
        } else {
            this.todoService
                .APIEmulator(() => this.todoService.addTodo(this.todoForm.value), 'add')
                .subscribe(() => {
                    this.notificationService.showNotification(NotificationVariants.NOTIFICATION, {
                        type: 'success',
                        title: 'Add Todo Success',
                    });
                    this.router.navigate(['/']);
                    this.handleResetForm();
                });
        }
    }

    handleResetForm() {
        this.todoForm.reset({
            id: '',
            title: '',
            deadline: [],
            isCompleted: false,
            details: '',
        });
    }

    fetchTodoById(id: number | string) {
        this.todoService
            .APIEmulator<Todo | null>(() => this.todoService.findTodoById(id), 'loadById')
            .subscribe((result) => {
                if (result) {
                    this.todoForm.patchValue({ ...result });
                }
            });
    }
}
