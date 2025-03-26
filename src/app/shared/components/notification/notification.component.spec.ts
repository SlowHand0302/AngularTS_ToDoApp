import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import { NotificationComponent } from './notification.component';
import { NotificationItem, NotificationService } from '../../services/notification.service';
import { notificationItem, mixedNotificationItem } from '../../mockups/testNotificationComponent.mockup';

describe('NotificationComponent', () => {
    let component: NotificationComponent;
    let fixture: ComponentFixture<NotificationComponent>;
    let service: Partial<NotificationService>;
    let notificationSubject: BehaviorSubject<NotificationItem[]>;

    const createService = () => {
        notificationSubject = new BehaviorSubject<NotificationItem[]>([]);
        service = {
            notificationSubject$: notificationSubject.asObservable(),
            showNotification: jest.fn(),
            closeNotification: jest.fn(),
        };
    };

    const createComponent = () => {
        fixture = TestBed.createComponent(NotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    beforeEach(async () => {
        createService();
        await TestBed.configureTestingModule({
            imports: [NotificationComponent],
            providers: [{ provide: NotificationService, useValue: service }],
        }).compileComponents();
        createComponent();
    });

    afterEach(() => {
        fixture?.destroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should subscribe and get initial value from BehaviorSubject', () => {
        fixture.detectChanges(); // Triggers `ngOnInit`
        expect(component.notifications.length).toBe(0);
    });

    it.each(mixedNotificationItem)(
        'should render right notification base on $variant: $content',
        ({ cssQuery, ...notificationItem }) => {
            notificationSubject.next([...notificationSubject.value, notificationItem as NotificationItem]);
            fixture.detectChanges();
            let notify = fixture.debugElement.query(By.css(cssQuery));
            expect(notify).toBeTruthy();
        },
    );

    it.each(notificationItem)('should react to single change in service: %j', ({ cssQuery, ...notificationItem }) => {
        notificationSubject.next([...notificationSubject.value, notificationItem as NotificationItem]);
        fixture.detectChanges();
        let notify = fixture.debugElement.query(By.css(cssQuery));
        expect(notify).toBeTruthy();

        notificationSubject.next([
            ...notificationSubject.value.map((item) =>
                item.id === notificationItem.id ? { ...item, hide: true } : item,
            ),
        ]);
        fixture.detectChanges();
        notify = fixture.debugElement.query(By.css(cssQuery));
        expect(notify).toBeTruthy();

        notificationSubject.next([...notificationSubject.value.filter((item) => item.id !== notificationItem.id)]);
        fixture.detectChanges();
        notify = fixture.debugElement.query(By.css(cssQuery));
        expect(notify).toBeFalsy();
    });

    it('should call closeNotification when clicking the close button', () => {
        const mockNewNotification = {
            id: Date.now(),
            hide: false,
            variant: notificationItem[0].variant,
            content: notificationItem[0].content,
        } as NotificationItem;

        notificationSubject.next([mockNewNotification]);
        fixture.detectChanges();

        // 🔹 Simulate user clicking the close button
        const closeButton = fixture.debugElement.query(By.css('.cds--inline-notification__close-button'));
        closeButton.nativeElement.click();

        // 🔹 Verify that the service method was called
        expect(service.closeNotification).toHaveBeenCalledWith(mockNewNotification.id);
    });
});
