import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../../../controllers/authentication';
import userController from '../../../controllers/user';
import validationController from '../../../controllers/validation';
import { IUser } from '../../../models';

export interface IRegistrationRequest {
    email: string;
    password: string;
    displayName: string;
    avatar: string;
}

export interface IRegistrationResponse {
    user: IUser;
}

const router = Router();

export const validation = [
    check('email', 'The provided email value was invalid').isEmail(),
    check('password', 'Password should be at least 8 characters long.')
        .isString()
        .isLength({ min: 8, max: 200 }),
    check('displayName', 'The provided display name is invalid')
        .isString()
        .isLength({ min: 1, max: 200 }),
    check('avatar', 'The provided avatar is invalid')
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

