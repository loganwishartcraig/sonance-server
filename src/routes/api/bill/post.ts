import { IResponseLocals, ILoadedResponseLocals } from '@common/types';
import { billController, validationController } from '@controllers';
import { IBill } from '@models';
import { Router } from 'express';
import { Request, Response } from 'express-serve-static-core';
import { checkSchema, ValidationParamSchema } from 'express-validator';
import { ICreateLineItemRequest } from './billId/lines/post';

const router = Router();
export interface INewBillBodyRequest {
    bill: {
        tax: number;
        tip: number;
        lines?: ICreateLineItemRequest['line'][];
    };
}

export interface INewBillBodyResponse {
    bill: IBill;
}

const bodySchemaValidation: Record<string, ValidationParamSchema> = {
    bill: {
        in: 'body',
        custom: {
            options: (value, { req, location, path }) => !!value,
        },
    },
    'bill.tax': {
        in: 'body',
        errorMessage: 'Bill cannot have a non numeric tax amount.',
        isNumeric: true,
        custom: {
            errorMessage: 'Bill tax amount must be greater than or equal to zero.',
            options: (value: any) => {
                return typeof value === 'number' && !isNaN(value) && value >= 0;
            },
        },
    },
    'bill.tip': {
        in: 'body',
        errorMessage: 'Bill cannot have a non numeric tip amount.',
        isNumeric: true,
        custom: {
            errorMessage: 'Bill tip amount must be greater than or equal to zero.',
            options: (value: any) => {
                return typeof value === 'number' && !isNaN(value) && value >= 0;
            },
        },
    },
};

router.post(
    '/',
    checkSchema(bodySchemaValidation),
    validationController.ensureNoErrors,
    billController.createBill,
    billController.saveBill,
    (_: Request, res: Response) => {

        const { bill } = res.locals as ILoadedResponseLocals;

        const payload: INewBillBodyResponse = {
            bill: bill.toJSON(),
        };

        return res.json(payload);

    }
);

export { router as rootPostRouter };
