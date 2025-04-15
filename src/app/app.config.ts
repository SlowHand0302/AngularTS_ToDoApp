import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authVerifyInterceptor } from './shared/interceptors/authVerify.interceptor';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { taskReducer } from './shared/stores/task/task.reducers';
import { TaskEffects } from './shared/stores/task/task.effects';
import { setHeaderInterceptor } from './shared/interceptors/set-header.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(withInterceptors([authVerifyInterceptor, setHeaderInterceptor])),
        provideStore({ task: taskReducer }),
        provideEffects(TaskEffects),
    ],
};
