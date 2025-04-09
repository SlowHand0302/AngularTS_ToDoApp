export type APIResponse<T> = {
    statusCode: number;
    messages: string;
    metadata: T;
};
