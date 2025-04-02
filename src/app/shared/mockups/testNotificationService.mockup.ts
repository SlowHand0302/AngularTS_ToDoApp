import { NotificationVariants } from '../services/notification.service';

export const notificationItem = [
    {
        variant: NotificationVariants.NOTIFICATION,
        content: { type: 'info', title: 'Sample notification 1', message: 'Sample info message' },
    },
    {
        variant: NotificationVariants.TOAST,
        content: {
            type: 'info',
            title: 'Sample notification 2',
            message: 'Sample info message',
            subtitle: 'Sample Subtitle',
            caption: 'Samle Caption',
        },
    },
    {
        variant: NotificationVariants.NOTIFICATION,
        content: { type: 'info', title: 'Sample notification 3', message: 'Sample info message' },
    },
];
