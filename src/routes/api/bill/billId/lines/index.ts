import { Router } from 'express';
import { getAllLinesRouter } from './get';

const router = Router();

router.use(
    '/lines',
    getAllLinesRouter
);

export { router as lineRouter };
