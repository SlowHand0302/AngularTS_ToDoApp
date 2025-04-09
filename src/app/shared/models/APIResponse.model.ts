export interface APIResponse<T> {
    statusCode: number;
    messages: string;
    metadata: T;
}
