import { Router } from 'express';
import authController from '../../../controllers/authentication';

const router = Router();

router.post(
    '/logout',
    authController.logout
);

export { router as logoutRouter };
