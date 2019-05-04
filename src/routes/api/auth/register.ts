import { RequestHandler, Router } from 'express';
import { check } from 'express-validator/check';
import userController from '../../../controllers/user';
import passport = require('passport');
import { ensureNoValidationErrors } from '../../../middleware';
import authController from '../../../controllers/authentication';

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
    userController.createUser,
    authController.setCredentials,
    authController.authenticateLocal
);

export { router as registerRouter };

