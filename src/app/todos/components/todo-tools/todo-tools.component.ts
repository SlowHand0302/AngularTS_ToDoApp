import { Component } from '@angular/core';
import { IconService } from 'carbon-components-angular';

import { TodoService } from '../../services/todo.service';
import { ChevronSort16, ChevronDown16, ChevronUp16 } from '@carbon/icons';
import { SharedModule } from '../../../shared/shared.module';
import { Todo } from '../../../shared/models/todo.model';
import { todoFilterList, FilterListItem } from '../../../shared/models/filter.model';
import { SortListItem, todoSortList } from '../../../shared/models/sort.model';


@Component({
    selector: 'app-todo-tools',
    imports: [SharedModule],
    templateUrl: './todo-tools.component.html',
    styleUrl: './todo-tools.component.scss',
})
export class TodoToolsComponent {
    filterState: FilterListItem<Todo>[] = [...todoFilterList];
    sortState: SortListItem<Todo>[] = [...todoSortList];

    constructor(private todoService: TodoService, protected iconService: IconService) {
        iconService.registerAll([ChevronDown16, ChevronSort16, ChevronUp16]);
    }

    handleSelectSort(option: any) {
        const optionSelected = { ...option['item'] };
        this.todoService.setSortOption({
            key: optionSelected.key,
            order: optionSelected.order,
        });
    }

    handleSelectFilter(option: any) {
        const optionSelected = { ...option['item'] };
        this.todoService.setFilterOption({
            key: optionSelected.key,
            value: optionSelected.value,
        });
    }
}
