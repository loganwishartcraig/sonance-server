import { Router } from 'express';
import { checkSchema, ValidationParamSchema } from 'express-validator';
import { IBillBody } from '@models';
import { validationController, billController } from '@controllers';

const router = Router();
export interface INewBillBodyRequest {
    bill: {
        tax: number;
        tip: number;
        lines?: any[];
        participants?: any[];
    };
}

export interface INewBillBodyResponse {
    bill: IBillBody;
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
    billController.createBill
);

export { router as rootPostRouter };
