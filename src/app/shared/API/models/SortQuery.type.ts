export type SortQuery<T> = {
    [K in keyof T]?: 'asc' | 'desc';
};
