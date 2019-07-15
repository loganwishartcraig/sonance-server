import { billController } from '@controllers';
import { IBillBody } from '@models';
import { Router } from 'express';

export interface IGetBillBodyResponse {
    bill: IBillBody;
}

const router = Router({ mergeParams: true });

router.get(
    '/',
    billController.getByIdForUser
);

export { router as getBillRouter };
