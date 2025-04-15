import { SuccessResponse } from '../types/SuccessResponse.interface';

export const successResponse = <T>(
    data: T,
    message: string,
    statusCode: number = 200,
    metadata: Object | null = null,
): SuccessResponse<T> => {
    return {
        statusCode,
        message,
        data,
        metadata,
    };
};
