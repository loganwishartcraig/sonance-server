import { RequestHandler } from 'express-serve-static-core';
import { validationResult } from 'express-validator/check';
import { GenericError } from '../../common/GenericError';
import { ValidationErrorCode } from '../../constants/error_codes';

export const ensureNoValidationErrors: RequestHandler = (req, res, next) => {

    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next(null);
    }

    return res
        .status(422)
        .json(new GenericError({
            code: ValidationErrorCode.INVALID_PAYLOAD,
            message: 'Invalid payload',
            meta: errors.array(),
        }));

};
