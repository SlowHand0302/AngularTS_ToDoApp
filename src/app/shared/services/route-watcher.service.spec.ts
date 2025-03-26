import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd, Event } from '@angular/router';
import { RouteWatcherService } from './route-watcher.service';
import { Observable, Subject } from 'rxjs';
import { single, multiple } from '../mockups/testRouteWatcher.mockups';

describe('RouteWatcherService', () => {
    let service: RouteWatcherService;
    let mockRouter: Partial<Router>;
    let eventsSubject: Subject<Event>;

    beforeEach(() => {
        // Create a subject to simulate router events
        eventsSubject = new Subject<Event>();

        // Create a mock router
        mockRouter = {
            events: eventsSubject.asObservable() as Observable<Event>,
        };

        TestBed.configureTestingModule({
            providers: [RouteWatcherService, { provide: Router, useValue: mockRouter }],
        });

        service = TestBed.inject(RouteWatcherService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it.each(single)('should return the url in each navigation: %s', (url) => {
        // Initial state check
        let currentUrl: string = '';
        const subscription = service.currentUrl$.subscribe((url) => {
            currentUrl = url;
        });
        expect(currentUrl).toBe('');

        // Simulate navigation event
        eventsSubject.next(new NavigationEnd(1, url, url));
        expect(currentUrl).toBe(url);

        // Clean up subscription
        subscription.unsubscribe();
    });

    it.each(multiple)('should track multiple navigation changes: %j', (testUrls) => {
        // Create an array to collect all emitted URLs
        const navigationUrls: string[] = [];
        const subscription = service.currentUrl$.subscribe((url) => {
            navigationUrls.push(url);
        });

        // Initial state
        expect(navigationUrls).toEqual(['']);

        testUrls.forEach((url, index) => {
            eventsSubject.next(new NavigationEnd(index + 1, url, url));
        });

        // Verify all navigations were tracked
        expect(navigationUrls.length).toBe(testUrls.length + 1); // +1 for initial empty value
        expect(navigationUrls.slice(1)).toEqual(testUrls);

        // Clean up subscription
        subscription.unsubscribe();
    });
});
