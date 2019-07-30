import { ILoadedResponseLocals } from '@common/types';
import { authController, billController, validationController } from '@controllers';
import { IBill } from '@models';
import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

export interface IGetAllBillBodiesResponse {
    bills: IBill[];
}

const router = Router();

const validation = [
    check('userId', 'No user ID was provided').isMongoId(),
];

router.get(
    '/',
    validation,
    validationController.ensureNoErrors,
    authController.matchesAuthenticatedUserId(({ query: { userId } }) => userId),
    billController.loadBillsForUser(({ query: { userId } }) => userId),
    (_req: Request, res: Response) => {

        const { bills } = res.locals as ILoadedResponseLocals;

        const payload: IGetAllBillBodiesResponse = {
            bills: bills.map(b => b.toJSON()),
        };

        res.json(payload);

    }
);

export { router as rootGetRouter };
