import { ILoadedResponseLocals } from '@common/types';
import { ILineItemConfig } from '@models';
import { Request, Response, Router } from 'express';
import { billController } from '@controllers';

export interface IGetLineByIdResponse {
    line: ILineItemConfig;
}

const router = Router({ mergeParams: true });

router.get(
    '/',
    billController.loadLineById(),
    (_req: Request, res: Response) => {

        const { line } = res.locals as ILoadedResponseLocals;

        const payload: IGetLineByIdResponse = {
            line: line.toJSON(),
        };

        res.json(payload);

    });

export { router as getLineByIdRouter };

