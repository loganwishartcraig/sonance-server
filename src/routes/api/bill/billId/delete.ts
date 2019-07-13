import { Router } from 'express';
import { check } from 'express-validator';
import billController from '../../../../controllers/bill';
import validationController from '../../../../controllers/validation';

const router = Router();

const validation = [
    check('billId', 'No bill ID was provided').isMongoId(),
];

router.delete(
    '/:billId',
    validation,
    validationController.ensureNoErrors,
    billController.deleteByIdForUser
);

export { router as deleteBillRoute };
