import { Router } from 'express';
import { getBillRouter } from './get';
import { deleteBillRoute } from './delete';
import { check } from 'express-validator';
import { validationController } from '@controllers';
import { lineRouter } from './lines';

const router = Router();
const validation = [
    check('billId', 'No valid bill ID was provided').isMongoId()
];


router.use(
    '/:billId',
    validation,
    validationController.ensureNoErrors,
    getBillRouter,
    deleteBillRoute,
    lineRouter
);

export { router as billIdRoutes };
