import { RequestHandler } from 'express-serve-static-core';
import { validationResult } from 'express-validator';
import { GenericError } from '../../common/GenericError';
import { ValidationErrorCode } from '../../constants/error_codes';
import { wrapCatch } from '../../common/Utilities';

class ValidationController {

    public ensureNoErrors: RequestHandler = wrapCatch(async (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new GenericError({
                httpStatus: 422,
                code: ValidationErrorCode.INVALID_PAYLOAD,
                message: 'Invalid payload',
                meta: errors.array(),
            });
        }

        next();

    });

}

const validationController = new ValidationController();

export default validationController;
