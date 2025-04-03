export interface SortOption<T> {
    key: keyof T;
    order: 'asc' | 'desc';
}
