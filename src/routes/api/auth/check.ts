import { Router } from 'express';
import authController from '../../../controllers/authentication';

const router = Router();

router.get(
    '/check',
    authController.checkAuth
);

export { router as checkRouter };
