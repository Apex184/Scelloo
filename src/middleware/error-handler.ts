import { Request, Response, NextFunction } from 'express';
import { HttpError, BaseHttpError } from '../errors/http-error';
import { ErrorMessage } from '../utils';

export const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (error instanceof HttpError) {
        return res.status(error.statusCode).json(error.serializeError());
    }

    console.error('Unhandled error:', error);

    const serverError = new BaseHttpError(ErrorMessage.ServerError, 500);
    return res.status(500).json(serverError.serializeError());
}; 