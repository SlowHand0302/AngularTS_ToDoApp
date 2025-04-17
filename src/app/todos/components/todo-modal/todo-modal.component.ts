import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouteWatcherService } from '../../../shared/services/route-watcher.service';
import { Store } from '@ngrx/store';
import { TaskState } from '../../../shared/stores/task/task.reducers';
import { selectLoading } from '../../../shared/stores/task/task.selectors';

@Component({
    selector: 'app-todo-modal',
    standalone: true,
    imports: [SharedModule, CommonModule],
    templateUrl: './todo-modal.component.html',
    styleUrl: './todo-modal.component.scss',
})
export class TodoModalComponent implements OnInit {
    modalState = input.required<boolean>();
    isLoading = signal<number>(0);
    modalTitle = '';
    private readonly store = inject(Store<{ tasks: TaskState }>);
    @Output() triggerCloseModal = new EventEmitter<Event>();
    constructor(private routeWatcher: RouteWatcherService) {}

    ngOnInit() {
        this.routeWatcher.currentUrl$.subscribe((url) => {
            this.modalTitle = url.split('/')[1];
        });
        this.store.select(selectLoading).subscribe((loadings) => {
            this.isLoading.set(loadings.size);
        });
    }

    handleOnCloseModal() {
        if (this.isLoading() <= 0) {
            this.triggerCloseModal.emit();
        }
    }
}
