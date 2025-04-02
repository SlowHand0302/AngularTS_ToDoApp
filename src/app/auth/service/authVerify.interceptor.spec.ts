import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse, HttpEvent, HttpRequest, provideHttpClient } from '@angular/common/http';
import { authVerifyInterceptor } from './authVerify.interceptor';
import { provideRouter, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

describe('authVerifyInterceptor', () => {
    let routerMock: Pick<Router, 'navigate'>;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        routerMock = { navigate: jest.fn().mockImplementation(() => Promise.resolve([])) };
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: Router, useValue: routerMock },
            ],
        });
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify(); // Ensure no unexpected requests
    });

    // Helper to mock next handler
    const mockNextHandler = (response: Observable<HttpEvent<unknown>>) => {
        return (req: HttpRequest<unknown>) => response;
    };

    it('should pass request to next handler if no error occurs', fakeAsync(() => {
        const req = new HttpRequest('GET', '/api/test');
        const mockResponse = of({ type: 4, body: 'Success' } as HttpEvent<unknown>);
        const next = mockNextHandler(mockResponse);

        let result: HttpEvent<unknown> | undefined;
        TestBed.runInInjectionContext(() => {
            authVerifyInterceptor(req, next).subscribe((event) => {
                result = event;
            });
        });

        tick();

        expect(result).toBeDefined();
        expect(result?.type).toBe(4); // HttpResponse event type
    }));

    it('should redirect to login and re-throw error on 401 with "No credentials provide"', fakeAsync(() => {
        const req = new HttpRequest('GET', '/api/test');
        const error = new HttpErrorResponse({
            status: 401,
            error: { msg: 'No credentials provide' },
        });
        const next = mockNextHandler(throwError(() => error));

        let thrownError: any;
        TestBed.runInInjectionContext(() => {
            authVerifyInterceptor(req, next).subscribe({
                error: (err) => (thrownError = err),
            });
        });

        tick();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
        expect(thrownError).toBe(error);
    }));

    it('should redirect to login and re-throw error on 401 with "Credential Expired"', fakeAsync(() => {
        const req = new HttpRequest('GET', '/api/test');
        const error = new HttpErrorResponse({
            status: 401,
            error: { msg: 'Credential Expired' },
        });
        const next = mockNextHandler(throwError(() => error));

        let thrownError: any;
        TestBed.runInInjectionContext(() => {
            authVerifyInterceptor(req, next).subscribe({
                error: (err) => (thrownError = err),
            });
        });

        tick();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
        expect(thrownError).toBe(error);
    }));
});
