import { Router } from 'express';
import { billController } from '@controllers';
import { IBillLineItem } from '@models';

const router = Router({ mergeParams: true });

export interface IGetBillLinesResponse {
    lines: IBillLineItem[];
}

router.get(
    '/',
    billController.getAllLinesForBill
);

export { router as getAllLinesRouter };
