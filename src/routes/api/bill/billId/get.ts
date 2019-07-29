import { billController } from '@controllers';
import { IBill } from '@models';
import { Router } from 'express';

export interface IGetBillBodyResponse {
    bill: IBill;
}

const router = Router({ mergeParams: true });

router.get(
    '/',
    billController.getByIdForUser
);

export { router as getBillRouter };
