import { Router } from 'express';
import { check } from 'express-validator/check';
import authController from '../../../../controllers/authentication';
import validationController from '../../../../controllers/validation';
import billController from '../../../../controllers/bill';

const router = Router();

const validation = [
    check('user', 'No user ID was provided').isMongoId(),
];

router.get(
    '/',
    authController.checkAuth,
    validation,
    validationController.ensureNoErrors,
    billController.getAllForUser
);

export { router as rootGetRouter };
