import { Router } from 'express';
import { billController } from '@controllers';

const router = Router({ mergeParams: true });

router.delete(
    '/',
    billController.deleteLineById
);

export { router as deleteLineByIdRouter };
