import { Router, Response, Request, RequestHandler } from 'express';
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
    billController.loadBillById(),
    permissionController.ensureUserCanRemoveParticipant,
    billController.removeUserFromBill,
    billController.saveBill,
    (req: Request, res: Response) => {
        res.sendStatus(204);
    }
)];

router.use(
    '/participants',
    routes,
);

export { router as billParticipantRoutes };

