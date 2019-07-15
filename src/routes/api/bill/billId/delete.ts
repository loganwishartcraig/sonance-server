import { billController } from '@controllers';
import { Router } from 'express';

const router = Router();

router.delete(
    '/',
    billController.deleteByIdForUser
);

export { router as deleteBillRoute };
