import { billController } from '@controllers';
import { ILineItem } from '@models';
import { Request, Response, Router } from 'express';
import { IResponseLocals, ILoadedResponseLocals } from '@common/types';

const router = Router({ mergeParams: true });

export interface IGetBillLinesResponse {
    lines: ILineItem[];
}

router.get(
    '/',
    billController.loadAllLinesForBill,
    (_req: Request, res: Response) => {

        const { lines } = res.locals as ILoadedResponseLocals;

        const payload: IGetBillLinesResponse = {
            lines: lines.map(l => l.toJSON()),
        };

        res.json(payload);

    }
);

export { router as getAllLinesRouter };

