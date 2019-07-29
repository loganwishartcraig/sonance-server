import { Router } from 'express';
import { check } from 'express-validator';
import { IBill } from '@models';
import { validationController, authController, billController } from '@controllers';

export interface IGetAllBillBodiesResponse {
    bills: IBill[];
}

const router = Router();

const validation = [
    check('userId', 'No user ID was provided').isMongoId(),
];

router.get(
    '/',
    validation,
    validationController.ensureNoErrors,
    authController.matchesAuthenticatedUserId(({ query: { userId } }) => userId),
    billController.getAllForUser
);

export { router as rootGetRouter };

