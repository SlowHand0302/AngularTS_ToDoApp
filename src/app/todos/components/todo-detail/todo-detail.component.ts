import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from '../../../shared/models/todo.model';
import { SharedModule } from '../../../shared/shared.module';
import { TodosComponent } from '../../todos.component';

@Component({
    selector: 'app-todo-detail',
    imports: [SharedModule, TodosComponent],
    templateUrl: './todo-detail.component.html',
    styleUrl: './todo-detail.component.scss',
})
export class TodoDetailComponent {
    private readonly aRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly todosComponent = inject(TodosComponent)

    todo!: Todo;

    ngOnInit() {
        this.aRoute.paramMap.subscribe((params) => {
            const id = params.get('id'); // Get the 'id' from the URL
            if (id) {
                this.fetchTodoById(+id); // Convert string to number
            }
        });
        console.log(this.aRoute.snapshot.paramMap.get('id'));
    }

    fetchTodoById(id: number | string) {
        const fetched = this.todosComponent.todos().find((item) => item.id === id);
        if (fetched) {
            this.todo = { ...fetched };
        }
    }
}
