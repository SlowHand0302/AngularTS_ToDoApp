import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RouteWatcherService {
    private currentUrl = new BehaviorSubject<string>('');
    currentUrl$ = this.currentUrl.asObservable();

    constructor(private router: Router) {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: any) => {
            this.currentUrl.next(event.url);
        });
    }
}
