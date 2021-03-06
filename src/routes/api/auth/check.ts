import { Router } from 'express';
import { authController } from '@controllers';

const router = Router();

router.get(
    '/check',
    authController.checkAuth,
    (_req, res) => {
        res.sendStatus(204);
    }
);

export { router as checkRouter };
