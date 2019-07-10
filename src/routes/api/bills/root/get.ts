import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../../../../controllers/authentication';
import billController from '../../../../controllers/bill';
import validationController from '../../../../controllers/validation';

const router = Router();

const validation = [
    check('userId', 'No user ID was provided').isMongoId(),
];

router.get(
    '/',
    validation,
    validationController.ensureNoErrors,
    authController.matchesAuthenticatedUserId(({ query: { userId } }) => userId),
    billController.getAllForUser
);

export { router as rootGetRouter };

