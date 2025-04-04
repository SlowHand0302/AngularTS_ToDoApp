import { TestBed } from '@angular/core/testing';

import { NotificationItem, NotificationService, NotificationVariants } from './notification.service';
import { NotificationContent } from 'carbon-components-angular';
import { Subscription } from 'rxjs';
import { notificationItem } from '../mockups/testNotificationService.mockup';

describe('NotificationService', () => {
    let service: NotificationService;
    let notifications: NotificationItem[] = [];
    let subscription: Subscription;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NotificationService],
        });
        service = TestBed.inject(NotificationService);
        subscription = service.notificationSubject$.subscribe((notifies) => {
            notifications = [...notifies];
        });
        jest.useFakeTimers();
    });

    afterEach(() => {
        subscription.unsubscribe();
        jest.clearAllTimers();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initiate with empty array', () => {
        expect(notifications.length).toBe(0);
    });

    describe.each([...notificationItem])('showNotification: %j', ({ variant, content }) => {
        it('should add valid content base on variant for new notification', () => {
            expect(() => service.showNotification(variant, content as any)).not.toThrow();
            expect(notifications.length).toBe(1);
            expect(notifications[0].variant).toEqual(variant);
            expect(notifications[0].content).toMatchObject(content);
        });
        it('should preserve content through lifecycle', () => {
            service.showNotification(variant, content as any);
            expect(notifications.length).toBe(1);
            expect(notifications[0].variant).toEqual(variant);
            expect(notifications[0].content).toMatchObject(content);

            jest.advanceTimersByTime(4500);
            expect(notifications[0].hide).toBeTruthy();
            expect(notifications[0].content).toMatchObject(content);

            jest.advanceTimersByTime(500);
            expect(notifications.length).toBe(0);
        });
    });

    it('showNotification should handle multiple notifications independently', () => {
        service.showNotification(NotificationVariants.NOTIFICATION, {
            type: 'info',
            title: 'First',
            message: 'First message',
        } as NotificationContent);
        service.showNotification(NotificationVariants.NOTIFICATION, {
            type: 'info',
            title: 'Second',
            message: 'Second message',
        } as NotificationContent);
        expect(notifications.length).toBe(2);

        jest.advanceTimersByTime(4500);
        expect(notifications[0].hide).toBeTruthy();
        expect(notifications[1].hide).toBeTruthy();

        jest.advanceTimersByTime(500);
        expect(notifications.length).toBe(0);
    });

    it('should manually close a notification', () => {
        const sampleNotification = { type: 'info', title: 'First', message: 'First message' };
        service.showNotification(
            NotificationVariants.NOTIFICATION,
            sampleNotification as NotificationContent,
        );
        expect(notifications.length).toBe(1);
        expect(notifications[0].variant).toEqual(NotificationVariants.NOTIFICATION);
        expect(notifications[0].content).toMatchObject(sampleNotification);

        service.closeNotification(notifications[0].id);
        expect(notifications[0].hide).toBeTruthy();
        expect(notifications[0].content).toMatchObject(sampleNotification);

        jest.advanceTimersByTime(500);
        expect(notifications.length).toBe(0);
    });

    it('should manually close multiple notifications independently', () => {
        const sampleNotification1 = { type: 'info', title: 'First', message: 'First message' };
        const sampleNotification2 = { type: 'info', title: 'Second', message: 'Second message' };

        service.showNotification(
            NotificationVariants.NOTIFICATION,
            sampleNotification1 as NotificationContent,
        );
        service.showNotification(
            NotificationVariants.NOTIFICATION,
            sampleNotification2 as NotificationContent,
        );

        expect(notifications.length).toBe(2);
        expect(notifications[0].variant).toEqual(NotificationVariants.NOTIFICATION);
        expect(notifications[0].content).toMatchObject(sampleNotification1);
        expect(notifications[1].variant).toEqual(NotificationVariants.NOTIFICATION);
        expect(notifications[1].content).toMatchObject(sampleNotification2);

        service.closeNotification(notifications[0].id);
        service.closeNotification(notifications[1].id);
        expect(notifications[0].hide).toBeTruthy();
        expect(notifications[0].content).toMatchObject(sampleNotification1);
        expect(notifications[1].hide).toBeTruthy();
        expect(notifications[1].content).toMatchObject(sampleNotification2);

        jest.advanceTimersByTime(500);
        expect(notifications.length).toBe(0);
    });
});
