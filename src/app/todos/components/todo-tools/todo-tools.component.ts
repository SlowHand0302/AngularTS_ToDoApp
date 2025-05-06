import { Component, inject } from '@angular/core';
import { IconService, ListItem } from 'carbon-components-angular';


import { CarbonIcons } from '@app/shared/icons';
import { SharedModule } from '../../../shared/shared.module';
import { Todo } from '../../../shared/models/todo.model';
import { SortListItem, todoSortList } from '../../../shared/models/sort.model';
import { TaskState } from '../../../shared/stores/task/task.reducers';
import { Store } from '@ngrx/store';
import { TaskActions } from '../../../shared/stores/task/task.actions';
import { selectFilterQuery, selectSortQuery } from '../../../shared/stores/task/task.selectors';
import { TaskType, TaskStatus, TaskPriority } from '../../../shared/constants/variants.enum';
import { Task } from '../../../shared/models/task.model';
import { SortQuery } from '../../../shared/API/models/SortQuery.type';

@Component({
    selector: 'app-todo-tools',
    imports: [SharedModule],
    templateUrl: './todo-tools.component.html',
    styleUrl: './todo-tools.component.scss',
})
export class TodoToolsComponent {
    sortState: SortListItem<Todo>[] = [...todoSortList];
    private store = inject(Store<{ task: TaskState }>);
    readonly taskTypes = Object.keys(TaskType).map((item) => ({ field: 'Type', content: item, selected: false }));
    readonly taskStatuses = Object.keys(TaskStatus).map((item) => ({
        field: 'Status',
        content: item,
        selected: false,
    }));
    readonly taskPriorities = Object.keys(TaskPriority).map((item) => ({
        field: 'Priority',
        content: item,
        selected: false,
    }));

    constructor(protected iconService: IconService) {
        iconService.registerAll([CarbonIcons.ChevronDown16, CarbonIcons.ChevronSort16, CarbonIcons.ChevronUp16]);
    }

    ngOnInit() {
        this.store.select(selectFilterQuery).subscribe((filter) => console.log(filter));
        this.store.select(selectSortQuery).subscribe((sort) => console.log(sort));
    }

    handleSelectSort(option: ListItem | ListItem[]) {
        const sort = option as SortListItem<Task>;
        const sortQuery: SortQuery<Task> = { [sort.key]: sort.order };
        if (option.length === 0) {
            this.store.dispatch(TaskActions.sortTask.unset());
        } else {
            this.store.dispatch(TaskActions.sortTask.set({ options: sortQuery }));
        }
    }

    handleSelectStatus(options: ListItem | ListItem[]) {
        const flatOptions: ListItem[] = options.flat();
        const contents: string[] = flatOptions.map((item) => item.content);
        if (contents.length === 0) {
            this.store.dispatch(TaskActions.filterTask.unset({ field: 'status' }));
            console.log(contents.length);
        } else {
            this.store.dispatch(
                TaskActions.filterTask.set({
                    options: {
                        status: { in: contents },
                    },
                }),
            );
        }
    }

    handleSelectType(options: ListItem | ListItem[]) {
        const flatOptions: ListItem[] = options.flat();
        const contents: string[] = flatOptions.map((item) => item.content);
        if (contents.length === 0) {
            this.store.dispatch(
                TaskActions.filterTask.unset({
                    field: 'type',
                }),
            );
        } else {
            this.store.dispatch(
                TaskActions.filterTask.set({
                    options: {
                        type: { in: contents },
                    },
                }),
            );
        }
    }

    handleSelectPriority(options: ListItem | ListItem[]) {
        const flatOptions: ListItem[] = options.flat();
        const contents: string[] = flatOptions.map((item) => item.content);
        if (contents.length === 0) {
            this.store.dispatch(
                TaskActions.filterTask.unset({
                    field: 'priority',
                }),
            );
        } else {
            this.store.dispatch(
                TaskActions.filterTask.set({
                    options: {
                        priority: { in: contents },
                    },
                }),
            );
        }
    }
}