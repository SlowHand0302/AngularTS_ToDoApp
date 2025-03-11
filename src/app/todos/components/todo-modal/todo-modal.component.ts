import { Component, EventEmitter, input, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
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
