import { Router } from 'express';
import { AuthenticationController } from '../../../controllers/authentication';

const router = Router();

router.get(
    '/check',
    AuthenticationController.checkAuth
);

export { router as checkRouter };
