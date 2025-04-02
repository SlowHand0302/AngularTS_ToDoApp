import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninComponent } from './signin.component';
import { AuthService } from '../service/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SigninComponent', () => {
    let component: SigninComponent;
    let fixture: ComponentFixture<SigninComponent>;
    let authServiceMock: Pick<AuthService, 'signin'>;
    let routerMock: Pick<
        Router,
        'navigate' | 'events' | 'routerState' | 'url' | 'createUrlTree' | 'serializeUrl'
    >;
    let notificationServiceMock: Pick<NotificationService, 'showNotification'>;

    const createServices = () => {
        routerMock = {
            navigate: jest.fn().mockImplementation(() => Promise.resolve([])),
            routerState: {
                snapshot: {
                    url: '',
                    root: new ActivatedRouteSnapshot(),
                },
                root: new ActivatedRoute(),
            },
            url: '/', // Mock current URL
            events: of(), // Mock router events as an empty observable
            createUrlTree: jest.fn().mockImplementation((commands, extras = {}) => {
                return { toString: () => commands.join('/') }; // Mock UrlTree
            }),
            serializeUrl: jest.fn().mockImplementation((urlTree) => {
                return urlTree.toString(); // Use the UrlTree's toString method
            }),
        };
        notificationServiceMock = { showNotification: jest.fn() };
        authServiceMock = { signin: jest.fn().mockReturnValue(of([])) };
    };

    beforeEach(async () => {
        createServices();
        await TestBed.configureTestingModule({
            imports: [SigninComponent, ReactiveFormsModule],
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: AuthService, useValue: authServiceMock },
                { provide: NotificationService, useValue: notificationServiceMock },
                { provide: ActivatedRoute, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SigninComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with empty inputs', () => {
        expect(component.signinForm.get('email')?.value).toBe('');
        expect(component.signinForm.get('password')?.value).toBe('');
    });

    it('should reset form when handResetForm called', () => {
        component.signinForm.patchValue({ email: 'test@example.com', password: 'password' });
        expect(component.signinForm.get('email')?.value).not.toBe('');
        expect(component.signinForm.get('password')?.value).not.toBe('');
        component.handleResetForm();
        expect(component.signinForm.get('email')?.value).toBe('');
        expect(component.signinForm.get('password')?.value).toBe('');
    });

    it('should disable submit button when form is invalid', () => {
        let submitButton = fixture.debugElement.query(By.css('button[type=submit]'));
        expect(submitButton.properties['disabled']).toBeTruthy();
    });

    it('should call signin API when submit button clicked', () => {
        component.signinForm.patchValue({ email: 'test@example.com', password: 'password' });
        component.onSubmit();
        expect(authServiceMock.signin).toHaveBeenCalled();
    });

    it('should show notification success and navigate to home page when signin success', () => {
        authServiceMock.signin = jest.fn().mockReturnValueOnce(of({ token: 'mockToken' }));

        const notificationSpy = jest.spyOn(notificationServiceMock, 'showNotification');

        component.signinForm.patchValue({ email: 'test@example.com', password: 'password' });
        component.onSubmit();

        expect(authServiceMock.signin).toHaveBeenCalled();
        expect(notificationSpy).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should show notification error when signin fail', () => {
        authServiceMock.signin = jest.fn().mockReturnValueOnce(of({ error: 'Invalid credentials' }));

        const notificationSpy = jest.spyOn(notificationServiceMock, 'showNotification');

        component.signinForm.patchValue({ email: 'wrong@example.com', password: 'wrongpassword' });
        component.onSubmit();

        expect(authServiceMock.signin).toHaveBeenCalled();
        expect(notificationSpy).toHaveBeenCalled();
    });
});
