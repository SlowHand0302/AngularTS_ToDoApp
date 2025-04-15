import { RequestHandler } from 'express';

export const catchAsync = <T>(fn: RequestHandler<T>): RequestHandler<T> => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
