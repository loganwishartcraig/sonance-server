import { Router, Request, Response } from 'express';
import { billController } from '@controllers';

const router = Router({ mergeParams: true });

router.delete(
    '/',
    billController.deleteLineById(),
    billController.saveBill,
    (_req: Request, res: Response) => {
        res.sendStatus(204);
    }
);

export { router as deleteLineByIdRouter };
