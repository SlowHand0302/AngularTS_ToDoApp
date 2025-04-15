export enum FilterComparisonOperators {
    eq = '$eq',
    ne = '$ne',
    gt = '$gt',
    gte = '$gte',
    lt = '$lt',
    lte = '$lte',
    in = '$in',
    nin = '$nin',
}

export type RawFilterQueryValue = {
    [key in keyof typeof FilterComparisonOperators]?: string;
};

export type RawFilterQuery<T> = Partial<Record<keyof T, RawFilterQueryValue>>;