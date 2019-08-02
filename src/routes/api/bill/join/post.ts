import { Router } from 'express';
import { IBill } from '@models';
import { billController } from '@controllers';
import { ILoadedResponseLocals } from '@common/types';

export interface IJoinBillRequest {
    shareCode: string;
}

export interface IJoinBillResponse {
    bill: IBill;
}

const router = Router();

router.post(
    '/join',
    billController.loadLineByShareCode(),
    billController.joinUserToBill,
    billController.saveBill,
    (_res, req) => {

        const { bill } = req.locals as ILoadedResponseLocals;

        req.json({ bill });

    }
);

export { router as joinBillRouter };
