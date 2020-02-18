import { ILoadedResponseLocals } from '@common/types';
import { billController } from '@controllers';
import { IBill } from '@models';
import { Request, Response, Router } from 'express';

export interface IGetBillBodyResponse {
    bill: IBill;
}

const router = Router({ mergeParams: true });

router.get(
    '/',
    billController.loadBillById(),
    (_req: Request, res: Response) => {

        const { bill } = res.locals as ILoadedResponseLocals;

        const payload: IGetBillBodyResponse = {
            bill: bill.toJSON(),
        };

        return res.json(payload);

    }
);

export { router as getBillRouter };

