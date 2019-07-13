import { Router } from 'express';
import { check } from 'express-validator';
import validationController from '../../../../controllers/validation';
import billController from '../../../../controllers/bill';
import { IBillBody } from '../../../../models';

export interface IGetBillBodyResponse {
    bill: IBillBody;
}

const router = Router();

const validation = [
    check('billId', 'No bill ID was provided').isMongoId(),
];

router.get(
    '/:billId',
    validation,
    validationController.ensureNoErrors,
    billController.getByIdForUser
);

export { router as getBillRouter };
