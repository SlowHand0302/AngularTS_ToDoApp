import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { NotificationComponent } from './shared/components/notification/notification.component';
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, SharedModule, NotificationComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'MyTodo';
}
