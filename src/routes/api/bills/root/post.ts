import { Router } from 'express';
import { checkSchema, ValidationParamSchema } from 'express-validator';
import billController from '../../../../controllers/bill';
import validationController from '../../../../controllers/validation';

const router = Router();

const bodySchemaValidation: Record<string, ValidationParamSchema> = {
    bill: {
        in: 'body',
        custom: {
            options: (value, { req, location, path }) => !!value,
        },
    },
    'bill.createdBy': {
        in: 'body',
        errorMessage: 'Bill cannot be created by an unknown user.',
        isMongoId: true,
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
