import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError } from "rxjs";

export function authVerifyInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const router = inject(Router); // Inject Router for redirection

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (
                (error.error.message === 'No credentials provide' || error.error.message === 'Credential Expired') &&
                error.status === 401
            ) {
                console.log('Unauthorized: Redirecting to login...');
                router.navigate(['/login']);
            }
            return throwError(() => error);
        }),
    );
}
