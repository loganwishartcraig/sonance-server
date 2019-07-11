import { GenericError, IGenericError } from './GenericError';
import { ErrorCode } from '../constants/error_codes';

export abstract class ErrorFactoryBase {
    abstract build(code: ErrorCode, overrides?: Partial<IGenericError>): GenericError;
}

export class ErrorFactory extends ErrorFactoryBase {

    private static _defaultMessages: {
        [key in ErrorCode]: string;
    } = {
            [ErrorCode.NOT_AUTHENTICATED]: 'You are not logged in.',
            [ErrorCode.AUTHENTICATION_FAILED]: 'We were unable to authenticate you.',
            [ErrorCode.USER_NOT_FOUND]: 'The requested user was not found',
            [ErrorCode.INVALID_CREDENTIALS]: 'Your credentials are invalid.',
            [ErrorCode.NOT_AUTHORIZED]: "You're not authorized to perform that action.",
            [ErrorCode.RECORD_NOT_FOUND]: 'The requested record was not found.',
            [ErrorCode.RECORD_ALREADY_EXISTS]: 'A record matching the given configuration already exists.',
            [ErrorCode.UNKNOWN_ERROR]: 'An unknown error ocurred.',
            [ErrorCode.INVALID_PAYLOAD]: 'The payload provided is invalid.',
        };

    private static _defaultHttpStatus: {
        [key in ErrorCode]: number;
    } = {
            [ErrorCode.NOT_AUTHENTICATED]: 401,
            [ErrorCode.AUTHENTICATION_FAILED]: 400,
            [ErrorCode.USER_NOT_FOUND]: 404,
            [ErrorCode.INVALID_CREDENTIALS]: 401,
            [ErrorCode.NOT_AUTHORIZED]: 401,
            [ErrorCode.RECORD_NOT_FOUND]: 404,
            [ErrorCode.RECORD_ALREADY_EXISTS]: 422,
            [ErrorCode.UNKNOWN_ERROR]: 500,
            [ErrorCode.INVALID_PAYLOAD]: 422,
        };

    public build(code: ErrorCode, overrides: Partial<Omit<IGenericError, 'code'>> = {}): GenericError {

        return new GenericError({
            code,
            message: this._resolveDefaultMessage(code),
            httpStatus: this._resolveDefaultHttpStatus(code),
            ...overrides,
        });

    }

    private _resolveDefaultMessage(code: ErrorCode): string {
        return ErrorFactory._defaultMessages[code];
    }

    private _resolveDefaultHttpStatus(code: ErrorCode): number {
        return ErrorFactory._defaultHttpStatus[code];
    }
}

export const globalErrorFactory = new ErrorFactory();
