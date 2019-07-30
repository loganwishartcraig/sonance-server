import { RequestHandler } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { ErrorFactoryBase, globalErrorFactory } from '@common/ErrorFactory';
import { wrapCatch } from '@common/Utilities';
import { ErrorCode } from '@constants/error_codes';
import { IResponseLocals } from '@common/types';
import { GenericError } from '@common/GenericError';
import { Response, Request } from 'express';

class ResponseController {

    private _errorFactory: ErrorFactoryBase;

    constructor(errorFactory: ErrorFactoryBase) {
        this._errorFactory = errorFactory;
    }

}

export const responseController = new ResponseController(globalErrorFactory);
