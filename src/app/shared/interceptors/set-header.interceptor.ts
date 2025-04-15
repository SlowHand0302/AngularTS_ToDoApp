import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const setHeaderInterceptor: HttpInterceptorFn = (req, next) => {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // Matches cache: 'no-store'
    });
    const requestWithHeader = req.clone({
        headers: headers,
        withCredentials: true,
    });
    return next(requestWithHeader);
};
