import { Router, Request, Response } from 'express';
import { ILineItemConfig } from '@models';
import { check } from 'express-validator';
import { validationController, billController } from '@controllers';
import { ILoadedResponseLocals } from '@common/types';

const router = Router({ mergeParams: true });

export interface ISplitLineRequest {
    ways: number;
}

export interface ISplitLineResponse {
    lines: ILineItemConfig[];
}

const validation = [
    check('ways', 'The number of ways the item is split must be a number greater than 1').isInt({ gt: 1 }),
];

router.post(
    '/split',
    validation,
    validationController.ensureNoErrors,
    billController.loadLineById(),
    billController.splitLine,
    billController.saveBill,
    (_req: Request, res: Response) => {

        const { lines } = res.locals as ILoadedResponseLocals;

        const payload: ISplitLineResponse = {
            lines: lines.map(l => l.toJSON()),
        };

        res.json(payload);

    }
);

export { router as splitLineRouter };
