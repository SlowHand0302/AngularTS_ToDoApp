import { NotificationVariants } from '../services/notification.service';

export const notificationItem = [
    {
        id: 1,
        hide: false,
        variant: NotificationVariants.NOTIFICATION,
        content: { type: 'info', title: 'Sample notification 1', message: 'Sample info message' },
        cssQuery: '.cds--inline-notification'
    },
    {
        id: 2,
        hide: false,
        variant: NotificationVariants.TOAST,
        content: { type: 'info', title: 'Sample toast 2', message: 'Sample info message' },
        cssQuery: '.cds--toast-notification'
    },
    {
        id: 3,
        hide: false,
        variant: NotificationVariants.ACTIONABLE,
        content: {
            type: 'info',
            title: 'Sample actionable 3',
            message: 'Sample info message',
            actions: [{ text: 'Sample Action', click: {} }],
        },
        cssQuery: '.cds--actionable-notification'
    },
];

export const mixedNotificationItem = [
    {
        id: 1,
        hide: false,
        variant: NotificationVariants.NOTIFICATION,
        content: { type: 'info', title: 'Sample notification 1', message: 'Sample info message' },
        cssQuery: '.cds--inline-notification'
    },
    {
        id: 2,
        hide: false,
        variant: NotificationVariants.TOAST,
        content: { type: 'info', title: 'Sample toast 2', message: 'Sample info message' },
        cssQuery: '.cds--toast-notification'
    },
    {
        id: 3,
        hide: false,
        variant: NotificationVariants.ACTIONABLE,
        content: {
            type: 'info',
            title: 'Sample actionable 3',
            message: 'Sample info message',
            actions: [{ text: 'Sample Action', click: {} }],
        },
        cssQuery: '.cds--actionable-notification'
    },
];
