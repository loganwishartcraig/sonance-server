import { Router } from 'express';
import { check } from 'express-validator';
import { validationController, billController } from '@controllers';
import { permissionController } from '@controllers/permission';

const router = Router({ mergeParams: true });

const validation = [
    check('participantId', 'No valid participant ID was provided').isMongoId(),
];

const routes: Router[] = [router.delete(
    '/:participantId',
    validation,
    validationController.ensureNoErrors,
    permissionController.ensureUserCanRemoveParticipant,
    billController.removeUserFromBill
)];

router.use(
    '/participant',
    routes,
);

export { router as joinBillRouter };

