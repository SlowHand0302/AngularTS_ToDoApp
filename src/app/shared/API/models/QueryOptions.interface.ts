import { RawFilterQuery } from './FilterQuery.type';
import { PaginationQuery } from './PaginationQuery.interface';
import { SearchQuery } from './SearchQuery.type';

export interface QueryOptions<T> {
    filter?: RawFilterQuery<T>;
    sort?: SortOption<T>[];
    search?: SearchQuery<T>;
    pagination?: PaginationQuery;
}

export type SortOption<T> = {
    [K in keyof T]?: 'asc' | 'desc';
};
