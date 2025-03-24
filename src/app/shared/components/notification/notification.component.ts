import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { Subject } from 'rxjs';
import { NotificationService, NotificationVariants, NotificationItem } from '../../services/notification.service';
import { ActionableContent, NotificationContent, ToastContent } from 'carbon-components-angular';

@Component({
    selector: 'app-notification',
    imports: [SharedModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
    actionSubject = new Subject<{ event: Event; action: any }>();
    notifications: NotificationItem[] = [];
    readonly notifiVariants = NotificationVariants;

    constructor(private notificationService: NotificationService) {}

    ngOnInit() {
        this.notificationService.notificationSubject$.subscribe((notifies) => {
            this.notifications = [...notifies];
        });
        this.actionSubject.subscribe({
            next(value) {
                console.log(value);
                if (value.action['fn']) {
                    value.action.fn();
                }
            },
        });
    }

    closeNotification(id: number) {
        this.notificationService.closeNotification(id);
    }

    showNotification() {
        const sampleNotification: NotificationContent = {
            type: 'info',
            title: 'Sample notification',
            message: 'Sample info message',
        };
        this.notificationService.showNotification(this.notifiVariants.NOTIFICATION, sampleNotification);
    }

    showToast() {
        const sampleToast: ToastContent = {
            type: 'info',
            title: 'Sample toast',
            subtitle: 'Sample subtitle message',
            caption: 'Sample caption',
            message: 'message',
        };
        this.notificationService.showNotification(this.notifiVariants.TOAST, sampleToast);
    }

    showActionable() {
        const sampleActionable: ActionableContent = {
            type: 'success',
            title: 'Actionable notification',
            message: 'Sample info message',
            subtitle: 'Sample subtitle message',
            caption: 'Sample caption',
            actions: [
                {
                    text: 'Action',
                    click: this.actionSubject,
                    fn: () => {
                        console.log('log navifate');
                    },
                },
            ],
        };
        this.notificationService.showNotification(this.notifiVariants.ACTIONABLE, sampleActionable);
    }
}
