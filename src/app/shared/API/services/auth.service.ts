import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.dev';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../models/SuccessResponse.interface';
import { User } from '../../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/auth`;

    public signIn(user: Pick<User, 'email' | 'password'>): Observable<SuccessResponse<User>> {
        return this.httpClient.post<SuccessResponse<User>>(`${this.baseUrl}/signIn`, user);
    }

    public signOut(): Observable<SuccessResponse<null>> {
        return this.httpClient.post<SuccessResponse<null>>(`${this.baseUrl}/signOut`, null);
    }
}
