import { Router } from 'express';
import { IBillLineItem } from '@models';
import { billController } from '@controllers';

export interface IGetLineByIdResponse {
    line: IBillLineItem;
}

const router = Router({ mergeParams: true });

router.get(
    '/',
    billController.getLineForBill
);

export { router as getLineByIdRouter };
