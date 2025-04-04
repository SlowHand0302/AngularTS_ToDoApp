import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { Subject } from 'rxjs';
import {
    NotificationService,
    NotificationVariants,
    NotificationItem,
} from '../../services/notification.service';

@Component({
    selector: 'app-notification',
    imports: [SharedModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
    actionSubject = new Subject<{ event: Event; action: any }>();
    notifications: NotificationItem[] = [];
    readonly notificationVariants = NotificationVariants;

    constructor(private notificationService: NotificationService) {}

    ngOnInit() {
        this.notificationService.notificationSubject$.subscribe((notifies) => {
            this.notifications = [...notifies];
        });
        // TODO: research more details
        this.actionSubject.subscribe({
            next(value) {
                if (value.action['fn']) {
                    value.action.fn();
                }
            },
        });
    }

    closeNotification(id: number) {
        this.notificationService.closeNotification(id);
    }
}
