import { RequestHandler } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { GenericError } from '../../common/GenericError';
import { ErrorCode } from '../../constants/error_codes';
import { wrapCatch } from '../../common/Utilities';
import { ErrorFactoryBase, globalErrorFactory } from '../../common/ErrorFactory';

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

const validationController = new ValidationController(globalErrorFactory);

export default validationController;
