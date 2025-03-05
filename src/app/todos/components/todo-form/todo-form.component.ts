import { Component, effect, Input, input, OnChanges, SimpleChanges } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Todo } from '../../../shared/models/todo.model';

@Component({
    selector: 'app-todo-form',
    imports: [SharedModule],
    templateUrl: './todo-form.component.html',
    styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent implements OnChanges {
    @Input() todo: Todo | null = null;
    deadline!: string[];
    constructor() {
        effect(() => {
            if (this.todo?.deadline) {
                this.deadline.push(this.todo.deadline);
            }
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.todo);
    }

    onSelectDate($event: any) {
        console.log('selectDate', $event.target.value);
    }
}
