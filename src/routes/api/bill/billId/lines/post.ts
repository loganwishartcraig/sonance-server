import { billController, validationController } from '@controllers';
import { ILineItemConfig } from '@models';
import { Router } from 'express';
import { checkSchema, ValidationParamSchema } from 'express-validator';
import { INewLineItemRequest } from '@services/LineItem';

const router = Router({ mergeParams: true });

export interface ICreateBillLineItemRequest {
    line: INewLineItemRequest;
}

export interface INewBillLineItemResponse {
    line: ILineItemConfig;
}

const bodySchemaValidation: Record<string, ValidationParamSchema> = {
    line: {
        in: 'body',
        custom: {
            options: (value, { req, location, path }) => !!value,
        },
    },
    'line.quantity': {
        in: 'body',
        errorMessage: 'A line item cannot have a non-numeric quantity.',
        isNumeric: true,
        custom: {
            errorMessage: 'The quantity must be greater than zero.',
            options: (value: any) => typeof value === 'number' && !isNaN(value) && value > 0,
        },
    },
    'line.price': {
        in: 'body',
        errorMessage: 'A line item cannot have a non-numeric price.',
        isNumeric: true,
        custom: {
            errorMessage: 'The price must be greater than or equal to zero.',
            options: (value: any) => typeof value === 'number' && !isNaN(value) && value >= 0,
        },
    },
    'line.isShared': {
        in: 'body',
        optional: true,
        isBoolean: true,
        errorMessage: 'The shared indicator must be true or false.',
    },
    'line.isClaimed': {
        in: 'body',
        optional: true,
        isBoolean: true,
        errorMessage: 'The claimed indicator must be true or false.',
    },
};

router.post(
    '/',
    checkSchema(bodySchemaValidation),
    validationController.ensureNoErrors,
    billController.createLineForBill
);

export { router as createLineRouter };

