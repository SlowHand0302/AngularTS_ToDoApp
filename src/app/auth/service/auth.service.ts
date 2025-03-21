import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpEventType,
    HttpHandler,
    HttpHandlerFn,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment.dev';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // Matches cache: 'no-store'
    });

    public signin(user: Pick<User, 'email' | 'password'>): Observable<User> {
        return this.httpClient.post<User>(`${environment.apiUrl}/auth/signIn`, user, {
            headers: this.headers,
            withCredentials: true,
        });
        // .pipe(catchError(this.handleError));
    }

    

    public testReq(): Observable<User> {
        return this.httpClient.get<User>(`${environment.apiUrl}/user/read`, {
            headers: this.headers,
            withCredentials: true,
        });
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        console.log(error);

        if (error.error instanceof ErrorEvent) {
            // Client-side error (e.g., network issue)
            errorMessage = `Client error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Server error ${error.status}: ${error.message}`;

            // If API returns an error message, use it
            if (error.error && error.error.msg) {
                errorMessage = error.error.msg;
            }
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage)); // Pass error message to subscribers
    }
}

export function authVerifyInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const router = inject(Router); // Inject Router for redirection

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (
                (error.error.msg === 'No credentials provide' || error.error.msg === 'Credential Expired') &&
                error.status === 401
            ) {
                console.warn('Unauthorized: Redirecting to login...');
                router.navigate(['/login']);
            }
            return throwError(() => error);
        }),
    );
}
