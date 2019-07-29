import { Router } from 'express';
import { IParticipant } from '@models';
import { billController } from '@controllers';

const router = Router({ mergeParams: true });

export interface IJoinBillRequest {
    shareCode: string;
}

export interface IJoinBillResponse {
    participant: IParticipant;
}

router.put(
    '/join',
    billController.joinUserToBill
);

export { router as joinBillRouter };
