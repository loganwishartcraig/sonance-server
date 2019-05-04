import { Router } from 'express';
import { check } from 'express-validator/check';
import authController from '../../../controllers/authentication';
import { ensureNoValidationErrors } from '../../../middleware';

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
    ensureNoValidationErrors,
    authController.authenticateLocal
);

export { router as loginRouter };

