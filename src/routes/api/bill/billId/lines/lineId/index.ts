import { Router } from 'express';
import { check } from 'express-validator';
import { getLineByIdRouter } from './get';
import { validationController } from '@controllers';
import { deleteLineByIdRouter } from './delete';

const router = Router({ mergeParams: true });

const validators = [
    check('lineId', 'An invalid Line ID was provided').isMongoId(),
];

router.use(
    '/:lineId',
    validators,
    validationController.ensureNoErrors,
    getLineByIdRouter,
    deleteLineByIdRouter
);

export { router as lineIdRouter };
