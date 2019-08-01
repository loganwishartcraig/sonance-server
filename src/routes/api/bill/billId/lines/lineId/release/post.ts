import { Router } from 'express';
import { billController } from '@controllers';

const router = Router({ mergeParams: true });

// TODO: Make sure the line can be released by the user
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
