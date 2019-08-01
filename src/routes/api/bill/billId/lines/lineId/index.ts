import { validationController } from '@controllers';
import { Router } from 'express';
import { check } from 'express-validator';
import { claimLineRouter } from './claim/post';
import { deleteLineByIdRouter } from './delete';
import { getLineByIdRouter } from './get';
import { releaseLineRouter } from './release/post';
import { splitLineRouter } from './split/post';

const router = Router({ mergeParams: true });

const validators = [
    check('lineId', 'An invalid Line ID was provided').isMongoId(),
];

router.use(
    '/:lineId',
    validators,
    validationController.ensureNoErrors,
    deleteLineByIdRouter,
    getLineByIdRouter,
    splitLineRouter,
    claimLineRouter,
    releaseLineRouter
);

export { router as lineIdRouter };

