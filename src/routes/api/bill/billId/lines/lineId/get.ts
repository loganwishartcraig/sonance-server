import { Router } from 'express';
import { ILineItemConfig } from '@models';
import { billController } from '@controllers';

export interface IGetLineByIdResponse {
    line: ILineItemConfig;
}

const router = Router({ mergeParams: true });

router.get(
    '/',
    billController.getLineForBill
);

export { router as getLineByIdRouter };
