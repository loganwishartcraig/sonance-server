import { Router } from 'express';
import { IBillParticipant } from '@models';
import { billController } from '@controllers';

const router = Router({ mergeParams: true });

export interface IJoinBillRequest {
    shareCode: string;
}

export interface IJoinBillResponse {
    participant: IBillParticipant;
}

router.put(
    '/join',
    billController.joinUserToBill
);

export { router as joinBillRouter };
