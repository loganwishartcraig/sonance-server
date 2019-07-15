import { Router } from 'express';
import { getAllLinesRouter } from './get';
import { createLineRouter } from './post';

const router = Router({ mergeParams: true });

router.use(
    '/lines',
    getAllLinesRouter,
    createLineRouter
);

export { router as lineRouter };
