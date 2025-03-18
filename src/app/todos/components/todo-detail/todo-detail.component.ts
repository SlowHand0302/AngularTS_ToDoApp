import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from '../../../shared/models/todo.model';
import { SharedModule } from '../../../shared/shared.module';
import { TodoService } from '../../services/todo.service';
import { TodoSkeletonsComponent } from '../todo-skeletons/todo-skeletons.component';

@Component({
    selector: 'app-todo-detail',
    imports: [SharedModule, TodoSkeletonsComponent],
    templateUrl: './todo-detail.component.html',
    styleUrl: './todo-detail.component.scss',
})
export class TodoDetailComponent {
    private readonly aRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly todoService = inject(TodoService);
    isLoading = signal<boolean>(false);
    todo!: Todo;

    ngOnInit() {
        this.aRoute.paramMap.subscribe((params) => {
            const id = params.get('id'); // Get the 'id' from the URL
            if (id) {
                this.fetchTodoById(+id); // Convert string to number
            }
        });
        this.todoService.isLoading('loadById').subscribe((result) => {
            this.isLoading.set(result);
        });
    }

    fetchTodoById(id: number | string) {
        this.todoService
            .APIEmulator<Todo | null>(() => this.todoService.findTodoById(id), 'loadById')
            .subscribe((result) => {
                if (result) {
                    this.todo = { ...result };
                }
            });
    }
}
