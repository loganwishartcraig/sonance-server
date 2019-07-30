import { Router } from 'express';
import { getBillRouter } from './get';
import { deleteBillRoute } from './delete';
import { check } from 'express-validator';
import { validationController, billController } from '@controllers';
import { lineRouter } from './lines';

const router = Router();

const validation = [
    check('billId', 'No valid bill ID was provided').isMongoId(),
];

const routes: Router[] = [
    getBillRouter,
    deleteBillRoute,
];

router.use(
    '/:billId',
    validation,
    validationController.ensureNoErrors,
    routes,
    lineRouter
);

export { router as billIdRoutes };
