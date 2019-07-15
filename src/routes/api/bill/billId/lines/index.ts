import { Router } from 'express';
import { getAllLinesRouter } from './get';
import { createLineRouter } from './post';
import { lineIdRouter } from './lineId';

const router = Router({ mergeParams: true });

router.use(
    '/lines',
    getAllLinesRouter,
    createLineRouter,
    lineIdRouter
);

export { router as lineRouter };
