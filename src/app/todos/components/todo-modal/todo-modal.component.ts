import { Component, effect, EventEmitter, input, Input, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../shared/models/todo.model';
import { RouteWatcherService } from '../../../shared/services/route-watcher.service';

@Component({
    selector: 'app-todo-modal',
    standalone: true,
    imports: [SharedModule, CommonModule],
    templateUrl: './todo-modal.component.html',
    styleUrl: './todo-modal.component.scss',
})
export class TodoModalComponent {
    modalState = input.required<boolean>();
    modalTitle = '';
    @Output() triggerCloseModal = new EventEmitter<Event>();
    constructor(private routeWatcher: RouteWatcherService) {}

    ngOnInit() {
        this.routeWatcher.currentUrl$.subscribe((url) => {
            this.modalTitle = url.split('/')[1];
        });
    }
}
