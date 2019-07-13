import { RequestHandler } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { ErrorFactoryBase, globalErrorFactory } from '@common/ErrorFactory';
import { wrapCatch } from '@common/Utilities';
import { ErrorCode } from '@constants/error_codes';

class ValidationController {

    private _errorFactory: ErrorFactoryBase;

    constructor(errorFactory: ErrorFactoryBase) {
        this._errorFactory = errorFactory;
    }

    public ensureNoErrors: RequestHandler = wrapCatch(async (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw this._errorFactory.build(ErrorCode.INVALID_PAYLOAD, {
                meta: errors.array(),
            });
        }

        next();

    });

}

export const validationController = new ValidationController(globalErrorFactory);
