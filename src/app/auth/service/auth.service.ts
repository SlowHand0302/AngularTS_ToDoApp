import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment.dev';

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

}
