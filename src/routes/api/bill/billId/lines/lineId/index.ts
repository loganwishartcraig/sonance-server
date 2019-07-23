import { Router } from 'express';
import { check } from 'express-validator';
import { getLineByIdRouter } from './get';
import { validationController } from '@controllers';
import { deleteLineByIdRouter } from './delete';
import { splitLineRouter } from './split/post';
import { claimLineRouter } from './claim/post';
import { releaseLineRouter } from './release/post';

const router = Router({ mergeParams: true });

const validators = [
    check('lineId', 'An invalid Line ID was provided').isMongoId(),
];

router.use(
    '/:lineId',
    validators,
    validationController.ensureNoErrors,
    getLineByIdRouter,
    deleteLineByIdRouter,
    splitLineRouter,
    claimLineRouter,
    releaseLineRouter
);

export { router as lineIdRouter };
