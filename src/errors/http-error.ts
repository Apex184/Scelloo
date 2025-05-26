export abstract class HttpError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, HttpError.prototype);
    }

    abstract serializeError(): {
        success: boolean;
        message: string;
        data: null;
    };
}

export class BaseHttpError extends HttpError {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, BaseHttpError.prototype);
    }

    serializeError() {
        return {
            success: false,
            message: this.message,
            data: null,
        };
    }
} 