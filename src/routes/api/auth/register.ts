import { IUser } from '@models';
import { Router } from 'express';
import { check } from 'express-validator';
import { validationController, userController, authController } from '@controllers';

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

