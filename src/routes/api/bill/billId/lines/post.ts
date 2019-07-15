import { validationController, billController } from '@controllers';
import { IBillLineItem } from '@models';
import { Request, Router } from 'express';
import { Response } from 'express-serve-static-core';
import { checkSchema, ValidationParamSchema } from 'express-validator';

const router = Router({ mergeParams: true });

export interface INewBillLineItemRequest {
    line: {
        quantity: number;
        price: number;
        isClaimed?: boolean;
        isShared?: boolean;
    };
}

export interface INewBillLineItemResponse {
    line: IBillLineItem;
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