import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.dev';
import { User } from '../../models/user.model';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send signin request and return user data', fakeAsync(() => {
        const mockUser: User = {
            _id: 1,
            email: 'test@example.com',
            password: 'password',
            fullname: 'test',
            username: 'test',
            avatar: null,
            phoneNumber: '00000000',
        };
        const credentials = { email: 'test@example.com', password: 'password' };

        service.signIn(credentials).subscribe((user) => {
            expect(user).toEqual(mockUser);
        });

        tick(); // Wait for async HTTP request to fire

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/signIn`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(credentials);
        req.flush(mockUser);
    }));

    it('should handle signin error', fakeAsync(() => {
        const credentials = { email: 'test@example.com', password: 'wrongPassword' };
        const errorMessage = 'Invalid credentials';

        service.signIn(credentials).subscribe({
            next: () => fail('Expected an error, but got a response'),
            error: (error) => {
                expect(error.status).toBe(401);
                expect(error.statusText).toBe('Unauthorized');
            },
        });

        tick();

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/signIn`);
        req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
    }));

    it('should call send signin request and return nothing', fakeAsync(() => {
        const mockResponse = { success: true, data: undefined }; // Example structure of SuccessResponse<void>

        service.signOut().subscribe((response) => {
            expect(response).toBe(mockResponse);
        });
        tick();
        const req = httpMock.expectOne(`${environment.apiUrl}/auth/signOut`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toBeNull();
        req.flush(mockResponse);
    }));
});
