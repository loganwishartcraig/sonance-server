import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../../../controllers/authentication';
import validationController from '../../../controllers/validation';
import { IUser } from '../../../models';

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    user: IUser;
}

const router = Router();

const validation = [
    check('email', 'The provided email value was invalid').isEmail(),
    check('password', 'Password should be at least 8 characters long.')
        .isString()
        .isLength({ min: 8 }),
];

router.post(
    '/login',
    validation,
    validationController.ensureNoErrors,
    authController.authenticateLocal
);

export { router as loginRouter };
