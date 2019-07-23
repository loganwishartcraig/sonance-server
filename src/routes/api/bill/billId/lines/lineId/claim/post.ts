import { Router } from 'express';
import { billController } from '@controllers';

const router = Router({ mergeParams: true });

export interface IClaimLineResponse {
    claimedOn: string;
}

router.post(
    '/claim',
    billController.claimLine
);

export { router as claimLineRouter };
