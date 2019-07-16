import { Router } from 'express';
import { IBillLineItem } from '@models';
import { check } from 'express-validator';
import { validationController, billController } from '@controllers';

const router = Router({ mergeParams: true });

export interface ISplitLineRequest {
    ways: number;
}

export interface ISplitLineResponse {
    lines: IBillLineItem[];
}

const validation = [
    check('ways', 'The number of ways the item is split must be a number greater than 0').isInt({ gt: 0 }),
];

router.post(
    '/split',
    validation,
    validationController.ensureNoErrors,
    billController.splitLines
);

export { router as splitLineRouter };
