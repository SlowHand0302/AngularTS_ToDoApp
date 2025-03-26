import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Todo } from '../../../shared/models/todo.model';
import { SharedModule } from '../../../shared/shared.module';
import { TodoService } from '../../services/todo.service';
import { TodoSkeletonsComponent } from '../todo-skeletons/todo-skeletons.component';
import { TodoSkeletonVariants } from '../../../shared/constants/varianst.enum';

@Component({
    selector: 'app-todo-detail',
    imports: [SharedModule, TodoSkeletonsComponent],
    templateUrl: './todo-detail.component.html',
    styleUrl: './todo-detail.component.scss',
})
export class TodoDetailComponent implements OnInit {
    private readonly aRoute = inject(ActivatedRoute);
    private readonly todoService = inject(TodoService);
    readonly skeletonVariants = TodoSkeletonVariants;
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
