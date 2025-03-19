import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { Subject } from 'rxjs';
import { NotificationService, NotificationVariants, NotificationItem } from '../../services/notification.service';

@Component({
    selector: 'app-notification',
    imports: [SharedModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
})
export class NotificationComponent {
    actionSubject = new Subject<any>();
    notifications: NotificationItem[] = [];
    readonly notifiVariants = NotificationVariants;

    constructor(private notificationService: NotificationService) {}

    ngOnInit() {
        this.notificationService.notificationSubject$.subscribe((notifies) => {
            this.notifications = [...notifies];
        });
    }

    closeNotification(id: number) {
        this.notificationService.closeNotification(id);
    }

    showNotification() {
        this.notificationService.showNotification(this.notifiVariants.NOTIFICATION, {
            type: 'info',
            title: 'Sample notification',
            message: 'Sample info message',
        });
    }

    showToast() {
        this.notificationService.showNotification(this.notifiVariants.TOAST, {
            type: 'info',
            title: 'Sample toast',
            subtitle: 'Sample subtitle message',
            caption: 'Sample caption',
            message: 'message',
        });
    }

    showActionable() {
        this.notificationService.showNotification(this.notifiVariants.ACTIONABLE, {
            type: 'success',
            title: 'Actionable notification',
            message: 'Sample info message',
            subtitle: 'Sample subtitle message',
            caption: 'Sample caption',
            actions: [
                {
                    text: 'Action',
                    click: this.actionSubject,
                },
            ],
        });
    }
}
