import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouteWatcherService } from '../../../shared/services/route-watcher.service';
import { TodoService } from '../../services/todo.service';

@Component({
    selector: 'app-todo-modal',
    standalone: true,
    imports: [SharedModule, CommonModule],
    templateUrl: './todo-modal.component.html',
    styleUrl: './todo-modal.component.scss',
})
export class TodoModalComponent {
    modalState = input.required<boolean>();
    isLoading = signal<number>(0);
    modalTitle = '';
    @Output() triggerCloseModal = new EventEmitter<Event>();
    constructor(private routeWatcher: RouteWatcherService, private todoService: TodoService) {}

    ngOnInit() {
        this.routeWatcher.currentUrl$.subscribe((url) => {
            this.modalTitle = url.split('/')[1];
        });
        this.todoService.loadingSet$.subscribe((state) => {
            this.isLoading.set(state.size);
            // console.log(state.size)
        });
    }

    handleOnCloseModal() {
        if (this.isLoading() <= 0) {
            this.triggerCloseModal.emit();
        }
    }
}
