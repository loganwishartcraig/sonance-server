import { billController } from '@controllers';
import { Router, Request, Response } from 'express';

const router = Router({ mergeParams: true });

router.delete(
    '/',
    billController.deleteBillById(),
    (_req: Request, res: Response) => {
        res.sendStatus(204);
    }
);

export { router as deleteBillRoute };
