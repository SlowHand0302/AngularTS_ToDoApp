export type SearchQuery<T> = {
    [K in keyof T]?: string;
};
