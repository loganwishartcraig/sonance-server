import { Router } from 'express';
import { checkSchema, ValidationParamSchema } from 'express-validator/check';
import authController from '../../../../controllers/authentication';
import billController from '../../../../controllers/bill';
import validationController from '../../../../controllers/validation';

const router = Router();

const bodySchemaValidation: Record<string, ValidationParamSchema> = {
    'bill.createdBy': {
        in: 'body',
        errorMessage: 'Bill cannot be created by an unknown user.',
        isMongoId: true,
    },
    'bill.totalAmount': {
        in: 'body',
        errorMessage: 'Bill cannot have a non numeric amount.',
        isNumeric: true,
        custom: {
            errorMessage: 'Bill amount must be greater than or equal to zero.',
            options: (value: any) => {
                return typeof value === 'number' && !isNaN(value) && value >= 0;
            },
        },
    },
    'bill.name': {
        in: 'body',
        optional: true,
        isString: true,
        isLength: {
            errorMessage: 'Bill name cannot exceed 100 characters.',
            options: { max: 100 },
        },
    },
};

router.post(
    '/',
    authController.checkAuth,
    checkSchema(bodySchemaValidation),
    validationController.ensureNoErrors,
    billController.createBill
);

export { router as rootPostRouter };

