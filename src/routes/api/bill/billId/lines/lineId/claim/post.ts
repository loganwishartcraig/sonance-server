import { ILoadedResponseLocals } from '@common/types';
import { billController } from '@controllers';
import { Router } from 'express';

const router = Router({ mergeParams: true });

export interface IClaimLineResponse {
    claimedOn: Date;
}

router.post(
    '/claim',
    billController.loadLineById(),
    billController.claimLine,
    billController.saveBill,
    (_res, req) => {

        const { line } = req.locals as ILoadedResponseLocals;

        const payload: IClaimLineResponse = {
            claimedOn: line.claimedOn as Date,
        };

        req.json(payload);

    }
);

export { router as claimLineRouter };
