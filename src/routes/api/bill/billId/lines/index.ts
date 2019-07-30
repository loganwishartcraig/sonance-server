import { Router } from 'express';
import { getAllLinesRouter } from './get';
import { createLineRouter } from './post';
import { lineIdRouter } from './lineId';
import { billController } from '@controllers';

const router = Router({ mergeParams: true });

router.use(
    '/lines',
    billController.loadBillById(),
    getAllLinesRouter,
    createLineRouter,
    lineIdRouter
);

export { router as lineRouter };
