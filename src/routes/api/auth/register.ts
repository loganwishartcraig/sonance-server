import { Router } from 'express';
import { check } from 'express-validator/check';
import { UserController } from '../../../controllers/user';
import { ensureNoValidationErrors } from '../../../middleware/validation/auth';
import passport = require('passport');

const router = Router();

export const validation = [
    check('email', 'The provided email value was invalid').isEmail(),
    check('password', 'Password should be at least 8 characters long.')
        .isString()
        .isLength({ min: 8, max: 200 }),
    check('nameFirst', 'The provided name value is invalid')
        .isString()
        .isLength({ min: 1, max: 200 }),
    check('nameLast', 'The provided name value is invalid')
        .isString()
        .isLength({ min: 1 }),
];

router.post(
    '/register',
    validation,
    ensureNoValidationErrors,
    UserController.createUser,
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })
);

export { router as registerRouter };
