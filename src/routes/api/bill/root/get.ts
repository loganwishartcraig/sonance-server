import { Router } from 'express';
import { check } from 'express-validator';
import billController from '../../../../controllers/bill';
import validationController from '../../../../controllers/validation';

const router = Router();

const validation = [
    check('user', 'No user ID was provided').isMongoId(),
];

router.get(
    '/',
    validation,
    validationController.ensureNoErrors,
    billController.getAllForUser
);

export { router as rootGetRouter };

