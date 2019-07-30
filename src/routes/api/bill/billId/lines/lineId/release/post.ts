import { Router } from 'express';
import { billController } from '@controllers';

const router = Router({ mergeParams: true });

router.post(
    '/release',
    billController.loadLineById(),
    billController.releaseLine,
    billController.saveBill,
    (_req, res) => {
        res.sendStatus(204);
    }
);

export { router as releaseLineRouter };
