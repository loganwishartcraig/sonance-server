import { RequestHandler } from 'express-serve-static-core';
import { validationResult } from 'express-validator/check';
import { GenericError } from '../../common/GenericError';
import { AuthenticationErrorCode } from '../../constants/error_codes';

export const ensureNoValidationErrors: RequestHandler = (req, res, next) => {

    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next(null);
    }

    return res
        .status(422)
        .json(new GenericError({
            code: AuthenticationErrorCode.NOT_AUTHORIZED,
            message: "You're not authorized to access that resource",
        }));

};
