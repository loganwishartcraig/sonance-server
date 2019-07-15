import { Router } from 'express';
import { check } from 'express-validator';
import { getLineByIdRouter } from './get';
import { validationController } from '@controllers';

const router = Router({ mergeParams: true });

const validators = [
    check('lineId', 'An invalid Line ID was provided').isMongoId(),
];

router.use(
    '/:lineId',
    validators,
    validationController.ensureNoErrors,
    getLineByIdRouter
);

export { router as lineIdRouter };
