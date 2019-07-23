import { Router } from 'express';
import { billController } from '@controllers';

const router = Router({ mergeParams: true });

router.post(
    '/release',
    billController.releaseLine
);

export { router as releaseLineRouter };
