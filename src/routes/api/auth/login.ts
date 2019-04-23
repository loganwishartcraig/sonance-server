import { ensureNoValidationErrors } from '../../../middleware/validation/auth';
import passport = require('passport');
import { check } from 'express-validator/check';
import { Router } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { GenericError } from '../../../common/GenericError';
import { AuthenticationErrorCode } from '../../../constants/error_codes';

const router = Router();

const validation = [
    check('email', 'The provided email value was invalid').isEmail(),
    check('password', 'Password should be at least 8 characters long.')
        .isString()
        .isLength({ min: 8 }),
];

const authenticator: RequestHandler = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

        if (err) {
            return next(err);
        }
        if (!user) {

            const error = new GenericError({
                code: AuthenticationErrorCode.INVALID_CREDENTIALS,
                message: 'Incorrect email or password. Please try again.',
            });

            return res.status(422).json(error.toJSON());

        }

        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.status(200).json({ user });
        });

    })(req, res, next);
};

router.post(
    '/login',
    validation,
    ensureNoValidationErrors,
    authenticator
);

export { router as loginRouter };
