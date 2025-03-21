import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly apiUrl = 'https://jsonplaceholder.typicode.com/todos?_limit=10';

    signin(): Observable<any> {
        return this.httpClient.get<any>(this.apiUrl);
    }
}
