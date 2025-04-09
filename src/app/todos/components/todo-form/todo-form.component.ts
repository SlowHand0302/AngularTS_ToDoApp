import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TaskState } from '../../../shared/stores/task/task.reducers';
import { TaskActions } from '../../../shared/stores/task/task.actions';
import { selectChosenTask, selectLoading } from '../../../shared/stores/task/task.selectors';
import { TodoSkeletonVariants } from '../../../shared/constants/variants.enum';
import { TodoSkeletonsComponent } from '../todo-skeletons/todo-skeletons.component';
import { AutoResizeDirective } from '../../../shared/directives/auto-resize.directive';
import { noWhitespaceValidator } from '../../../shared/validators/no-whitespace.validator';
import { TaskStatus, TaskPriority, TaskType } from '../../../shared/constants/variants.enum';
@Component({
    selector: 'app-todo-form',
    imports: [SharedModule, AutoResizeDirective, TodoSkeletonsComponent],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly aRoute = inject(ActivatedRoute);
    private store = inject(Store<{ task: TaskState }>);
    isSubmitted = false;
    isLoading = signal<boolean>(false);
    isEditingOrAdding = signal<boolean>(true);
    readonly skeletonsVariants = TodoSkeletonVariants;
    readonly taskTypes = Object.keys(TaskType).map((item) => ({ content: item, selected: false }));
    readonly taskStatuses = Object.keys(TaskStatus).map((item) => ({ content: item, selected: false }));
    readonly taskPriorities = Object.keys(TaskPriority).map((item) => ({ content: item, selected: false }));

    todoForm!: FormGroup;
    constructor(private fb: FormBuilder) {
        this.todoForm = this.fb.group({
            _id: '',
            title: ['', Validators.compose([Validators.required, Validators.minLength(6), noWhitespaceValidator()])],
            startDate: [[], Validators.compose([Validators.required])],
            endDate: [[], Validators.compose([Validators.required])],
            type: ['', Validators.compose([Validators.required])],
            status: ['', Validators.compose([Validators.required])],
            priority: ['', Validators.compose([Validators.required])],
            details: ['', Validators.compose([Validators.required, Validators.minLength(6), noWhitespaceValidator()])],
        });
    }

    ngOnInit() {
        this.aRoute.paramMap.subscribe((params) => {
            const id = params.get('id'); // Get the 'id' from the URL
            if (id) {
                this.fetchTodoById(id);
            } else {
                this.handleResetForm();
            }
        });

        this.store.select(selectLoading).subscribe((loadings) => {
            this.isLoading.set(loadings.has('loadTaskByID'));
            this.isEditingOrAdding.set(loadings.has('createTask') || loadings.has('updateTask'));
        });

        this.store.select(selectChosenTask).subscribe((task) => {
            if (task) {
                this.todoForm.patchValue({
                    ...task,
                    type: { content: task.type, selected: true },
                    status: { content: task.status, selected: true },
                    priority: { content: task.priority, selected: true },
                });
            }
        });
    }

    onCloseButtonClick() {
        this.router.navigate(['/']);
    }

    onSubmit() {
        const refactoredFormValue = {
            ...this.todoForm.value,
            creator: '669a32c1319ce66447539b05',
            assignee: '669a32c1319ce66447539b05',
            startDate: this.todoForm.value['startDate'][0],
            endDate: this.todoForm.value['endDate'][0],
            type: this.todoForm.value['type']['content'],
            status: this.todoForm.value['status']['content'],
            priority: this.todoForm.value['priority']['content'],
        };
        this.isSubmitted = true;
        if (this.todoForm.value['_id'] !== '') {
            this.store.dispatch(TaskActions.updateTask.request({ task: refactoredFormValue }));
        } else {
            delete refactoredFormValue['_id'];
            this.store.dispatch(TaskActions.createTask.request({ task: refactoredFormValue }));
        }
    }

    handleResetForm() {
        this.isSubmitted = false;
        this.store.dispatch(TaskActions.resetSelectedTasks());
        this.todoForm.reset({
            _id: '',
            title: '',
            startDate: [],
            endDate: [],
            type: '',
            priority: '',
            status: '',
            details: '',
        });
    }

    fetchTodoById(_id: string) {
        this.store.dispatch(TaskActions.loadTaskByID.request({ taskID: { _id } }));
    }
}
