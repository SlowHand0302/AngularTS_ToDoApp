import { ListItem } from 'carbon-components-angular';
import { Todo } from './todo.model';

export interface SortOption<T> {
    key: keyof T;
    order: 'asc' | 'desc';
}

export type SortListItem<T> = SortOption<T> & ListItem;

export const todoSortList: SortListItem<Todo>[] = [
    {
        key: 'title',
        order: 'asc',
        selected: true,
        content: 'Title Asc',
    },
    {
        key: 'title',
        order: 'desc',
        selected: false,
        content: 'Title Desc',
    },
    {
        key: 'deadline',
        order: 'asc',
        selected: false,
        content: 'Deadline Asc',
    },
    {
        key: 'deadline',
        order: 'desc',
        selected: false,
        content: 'Deadline Desc',
    },
];
