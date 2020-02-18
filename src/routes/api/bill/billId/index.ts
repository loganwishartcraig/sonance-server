import { validationController } from '@controllers';
import { Router } from 'express';
import { check } from 'express-validator';
import { deleteBillRoute } from './delete';
import { getBillRouter } from './get';
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

