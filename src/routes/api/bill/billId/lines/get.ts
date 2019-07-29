import { Router } from 'express';
import { billController } from '@controllers';
import { ILineItemConfig } from '@models';

const router = Router({ mergeParams: true });

export interface IGetBillLinesResponse {
    lines: ILineItemConfig[];
}

router.get(
    '/',
    billController.getAllLinesForBill
);

export { router as getAllLinesRouter };
