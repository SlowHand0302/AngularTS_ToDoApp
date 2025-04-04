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
    private notificationSubject: BehaviorSubject<NotificationItem[]> = new BehaviorSubject<
        NotificationItem[]
    >([]);
    private timeoutIds: Map<number, ReturnType<typeof setTimeout>> = new Map<
        number,
        ReturnType<typeof setTimeout>
    >();
    public notificationSubject$ = this.notificationSubject.asObservable();

    public showNotification<T extends NotificationVariants>(
        variant: T,
        content: T extends NotificationVariants.TOAST
            ? ToastContent
            : T extends NotificationVariants.ACTIONABLE
            ? ActionableContent
            : NotificationContent,
    ) {
        // Validate content structure based on variant
        if (
            (variant === NotificationVariants.NOTIFICATION && !this.isNotificationContent(content)) ||
            (variant === NotificationVariants.TOAST && !this.isToastContent(content)) ||
            (variant === NotificationVariants.ACTIONABLE && !this.isActionableContent(content))
        ) {
            throw new Error(`Invalid content structure for variant: ${variant}`);
        }

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
                ...this.notificationSubject.value.map((item) =>
                    item.id === id ? { ...item, hide: true } : item,
                ),
            ]);

            // Remove after animation delay
            setTimeout(() => {
                this.notificationSubject.next(this.notificationSubject.value.filter((n) => n.id !== id));
            }, 500); // Matches slide-out animation duration
        }
    }

    isNotificationContent(content: any): content is NotificationContent {
        return content && typeof content.type === 'string' && typeof content.title === 'string';
    }

    isToastContent(content: any): content is ToastContent {
        return (
            this.isNotificationContent(content) &&
            typeof content['subtitle'] === 'string' &&
            typeof content['caption'] === 'string'
        );
    }

    isActionableContent(content: any): content is ActionableContent {
        return (
            this.isNotificationContent(content) &&
            Array.isArray(content['actions']) &&
            content['actions'].every(
                (action) => typeof action.text === 'string' && typeof action.click === 'object',
            )
        );
    }
}
