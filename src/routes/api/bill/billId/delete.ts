import { billController } from '@controllers';
import { Router, Request, Response } from 'express';
import { permissionController } from '@controllers/permission';

const router = Router({ mergeParams: true });

router.delete(
    '/',
    permissionController.ensureUserCanDeleteBill,
    billController.deleteBillById(),
    (_req: Request, res: Response) => {
        res.sendStatus(204);
    }
);

export { router as deleteBillRoute };
