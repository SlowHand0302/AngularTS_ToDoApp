import { Component, signal } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { IconService, ListItem } from 'carbon-components-angular';

import { TodoModalComponent } from './components/todo-modal/todo-modal.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { Todo } from '../shared/models/todo.model';
import { RouteWatcherService } from '../shared/services/route-watcher.service';
import { TodoService } from './services/todo.service';
import { ChevronSort16, ChevronDown16, ChevronUp16 } from '@carbon/icons';

@Component({
    selector: 'app-todos',
    imports: [SharedModule, TodoModalComponent, TodoItemComponent, RouterLink, RouterOutlet],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.scss',
})
export class TodosComponent {
    todos = signal<Todo[]>([]);
    modalState = signal<boolean>(false);
    filterState: ListItem[] = [
        {
            content: 'All',
            icon: 'chevron--sort',
            selected: true,
        },
        {
            content: 'Completed',
            icon: 'chevron--sort',
            selected: false,
        },
        {
            content: 'Processing',
            icon: 'chevron--sort',
            selected: false,
        },
    ];

    sortState: ListItem[] = [
        {
            content: 'Title Asc',
            icon: 'chevron--up',
            selected: false,
        },
        {
            content: 'Title Desc',
            icon: 'chevron--down',
            selected: false,
        },
        {
            content: 'Deadline Asc',
            icon: 'chevron--up',
            selected: false,
        },
        {
            content: 'Deadline Desc',
            icon: 'chevron--down',
            selected: false,
        },
        {
            content: 'Clear Sort',
            icon: 'chevron--sort',
            selected: true,
        },
    ];

    constructor(
        private router: Router,
        private routeWatcher: RouteWatcherService,
        private todoService: TodoService,
        protected iconService: IconService,
    ) {
        iconService.registerAll([ChevronDown16, ChevronSort16, ChevronUp16]);
    }
    
    selectedItem: ListItem | null = {
        content: 'Clear Sort',
        icon: 'chevron--sort',
        selected: true,
    };

    ngOnInit() {
        this.routeWatcher.currentUrl$.subscribe((url) => {
            if (url.includes('add') || url.includes('edit') || url.includes('details')) {
                console.log('URL changed:', url); // Logs every URL change
                this.modalState.set(true);
            } else {
                this.modalState.set(false);
            }
        });

        this.todoService.todosSubject$.subscribe((todoList) => {
            this.todos.set([...todoList]);
        });
    }

    handleSelectSort(item: any) {
        this.sortState.forEach((i) => (i.selected = i === item));
        this.selectedItem = { ...item.item };
        console.log(item['item']);
    }

    isClearSortSelected(): boolean {
        return this.selectedItem?.content === 'Clear Sort' && this.selectedItem.selected;
    }

    handleTriggerCloseModal() {
        this.router.navigate(['/']);
        this.modalState.set(false);
    }
}
