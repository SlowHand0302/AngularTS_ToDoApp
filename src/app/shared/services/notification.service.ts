import { Injectable } from '@angular/core';
import {
    NotificationContent,
    NotificationType,
    ActionableContent,
    ToastContent,
    NotificationAction,
    NotificationLink,
} from 'carbon-components-angular';
import { BehaviorSubject } from 'rxjs';

export enum NotificationVariants {
    NOTIFICATION = 'Notification',
    TOAST = 'Toast',
    ACTIONABLE = 'Actionable',
}

interface BaseNotification<T extends NotificationVariants> {
    id: number;
    hide: boolean;
    variant: T;
    content: T extends NotificationVariants.TOAST
        ? ToastContent
        : T extends NotificationVariants.ACTIONABLE
        ? ActionableContent
        : NotificationContent;
}

export type NotificationItem =
    | BaseNotification<NotificationVariants.TOAST>
    | BaseNotification<NotificationVariants.ACTIONABLE>
    | BaseNotification<NotificationVariants.NOTIFICATION>;

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private notificationSubject: BehaviorSubject<NotificationItem[]> = new BehaviorSubject<NotificationItem[]>([]);
    public notificationSubject$ = this.notificationSubject.asObservable();

    constructor() {}

    public showNotification<T extends NotificationVariants>(
        variant: T,
        content: T extends NotificationVariants.TOAST
            ? ToastContent
            : T extends NotificationVariants.ACTIONABLE
            ? ActionableContent
            : NotificationContent,
    ) {
        console.log('Showing notification:', content);

        // Ensure the correct type is used based on the variant
        const newNotification = { id: Date.now(), hide: false, variant, content } as NotificationItem;
        this.notificationSubject.next([...this.notificationSubject.value, newNotification]);

        // Trigger slide-out before removing notification
        setTimeout(() => {
            newNotification.hide = true;
            this.notificationSubject.next([...this.notificationSubject.value]);

            setTimeout(() => {
                this.notificationSubject.next([
                    ...this.notificationSubject.value.filter((n) => n.id !== newNotification.id),
                ]);
            }, 500); // Matches slideOut animation duration
        }, 4500);
    }

    public closeNotification(id: number) {
        console.log(id);
    }
}
