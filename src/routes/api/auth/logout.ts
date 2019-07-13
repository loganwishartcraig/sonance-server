import { Router } from 'express';
import { authController } from '@controllers';

const router = Router();

router.post(
    '/logout',
    authController.logout
);

export { router as logoutRouter };
