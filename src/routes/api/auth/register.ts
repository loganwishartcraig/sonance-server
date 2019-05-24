import { Router } from 'express';
import { check } from 'express-validator/check';
import authController from '../../../controllers/authentication';
import userController from '../../../controllers/user';
import validationController from '../../../controllers/validation';

const router = Router();

export const validation = [
    check('email', 'The provided email value was invalid').isEmail(),
    check('password', 'Password should be at least 8 characters long.')
        .isString()
        .isLength({ min: 8, max: 200 }),
    check('firstName', 'The provided name value is invalid')
        .isString()
        .isLength({ min: 1, max: 200 }),
    check('lastName', 'The provided name value is invalid')
        .isString()
        .isLength({ min: 1 }),
];

router.post(
    '/register',
    validation,
    validationController.ensureNoErrors,
    userController.createUser,
    authController.setCredentials,
    authController.authenticateLocal
);

export { router as registerRouter };

