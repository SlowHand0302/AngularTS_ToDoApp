import { ListItem } from 'carbon-components-angular';
import { Todo } from './todo.model';

export interface FilterOption<T> {
    key: keyof T;
    value: T[keyof T] | null;
}

export type FilterListItem<T> = FilterOption<T> & ListItem;

export const todoFilterList: FilterListItem<Todo>[] = [
    {
        key: 'isCompleted',
        value: false,
        content: 'Processing',
        selected: false,
    },
    {
        key: 'isCompleted',
        value: true,
        content: 'Completed',
        selected: false,
    },
    {
        key: 'isCompleted',
        value: null,
        content: 'All',
        selected: true,
    },
];
