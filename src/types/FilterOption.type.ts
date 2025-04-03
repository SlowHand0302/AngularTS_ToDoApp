export interface FilterOption<T> {
    key: keyof T;
    value: T[keyof T] | null;
}
