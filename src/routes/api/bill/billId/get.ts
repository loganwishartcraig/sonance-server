import { IBillBody } from '@models';
import { Router } from 'express';
import { check } from 'express-validator';
import { validationController, billController } from '@controllers';

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

