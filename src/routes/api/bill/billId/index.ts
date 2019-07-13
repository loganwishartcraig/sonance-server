import { Router } from 'express';
import { getBillRouter } from './get';
import { deleteBillRoute } from './delete';

const router = Router();

router.use(
    '/:billId',
    getBillRouter,
    deleteBillRoute
);

export { router as billIdRoutes };
