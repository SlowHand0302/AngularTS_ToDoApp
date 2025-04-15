export interface SuccessResponse<T> {
    statusCode: number;
    message: string;
    data: T | null;
    metadata: Object | null;
}

export interface PaginationResponse {
    current?: number;
    size?: number;
    totalPage?: number;
    total?: number;
}
