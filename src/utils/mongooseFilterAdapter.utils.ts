import { FilterComparisonOperators, RawFilterQuery } from '../types/FilterQuery.type';
import { FilterQuery, Condition, SortOrder } from 'mongoose';
import { SearchQuery } from '../types/SearchQuery.type';

export const filterAdapter = <T>(filters: RawFilterQuery<T>): FilterQuery<T> => {
    const query: FilterQuery<T> = {};

    for (const field in filters) {
        const ops = filters[field];

        // TODO: handle wrong field or operator
        if (!ops) continue;

        const mongoOps: Condition<T[typeof field]> = {}; // ✅ Strong type per field

        for (const [op, value] of Object.entries(ops)) {
            const mongoOp = FilterComparisonOperators[op as keyof typeof FilterComparisonOperators];
            if (mongoOp) {
                mongoOps[mongoOp] = value;
            }
        }

        query[field as keyof T] = mongoOps;
    }

    return query;
};

export const sortAdapter = (sorts: string[]): [string, SortOrder][] => {
    return sorts.map((sort) => {
        const [field, order] = sort.split(':');

        const sortOrder =
            order === 'asc' ||
            order === 'desc' ||
            order === 'ascending' ||
            order === 'descending' ||
            order === '1' ||
            order === '-1'
                ? (order as SortOrder)
                : 'asc'; // fallback

        return [field, sortOrder];
    });
};

export const searchAdapter = <T>(searchQuery: SearchQuery<T>): FilterQuery<T> => {
    if (!searchQuery) return {} as FilterQuery<T>;
    return {
        [Object.keys(searchQuery)[0]]: { $regex: Object.values(searchQuery)[0], $options: 'i' },
    } as FilterQuery<T>;
};
