import { Injectable } from '@angular/core';
import { NotificationContent, ActionableContent, ToastContent } from 'carbon-components-angular';
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
    private timeoutIds: Map<number, ReturnType<typeof setTimeout>> = new Map<number, ReturnType<typeof setTimeout>>();
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
        const timeoutId = setTimeout(() => {
            newNotification.hide = true;
            this.notificationSubject.next([...this.notificationSubject.value]);

            setTimeout(() => {
                this.notificationSubject.next([
                    ...this.notificationSubject.value.filter((n) => n.id !== newNotification.id),
                ]);
            }, 500); // Matches slideOut animation duration
        }, 4500);
        this.timeoutIds.set(newNotification.id, timeoutId);
    }

    public closeNotification(id: number) {
        const timeoutId = this.timeoutIds.get(id);
        const notification = this.notificationSubject.value.find((item) => item.id === id);
        if (timeoutId || notification) {
            clearTimeout(timeoutId);

            this.notificationSubject.next([
                ...this.notificationSubject.value.map((item) => (item.id === id ? { ...item, hide: true } : item)),
            ]);

            // Remove after animation delay
            setTimeout(() => {
                this.notificationSubject.next(this.notificationSubject.value.filter((n) => n.id !== id));
            }, 500); // Matches slide-out animation duration
        }
    }
}
