import { ErrorFactoryBase, globalErrorFactory } from '@common/ErrorFactory';
import { GenericError } from '@common/GenericError';
import { ErrorCode } from '@constants/error_codes';
import { BillBody, IUser } from '@models';
import { RequestHandler } from 'express';

interface IPermissionControllerConfig {
    errorFactory: ErrorFactoryBase;
}

class PermissionController {

    private readonly _errorFactory: ErrorFactoryBase;

    constructor(config: IPermissionControllerConfig) {
        this._errorFactory = config.errorFactory;
    }

    public ensureUserCanViewBill: RequestHandler = (req, res, next) => {

        const user: IUser = req.user;
        const bill = res.locals.bill;

        if (!user || !user.id) {
            next(this._resolveInvalidUserError());
        } else if (!bill) {
            next(this._resolveInvalidBillError());
        } else if (!BillBody.createdByUser(bill, user) && !BillBody.userIsParticipant(bill, user)) {
            next(this._resolveNotAllowedError('You are is not allowed to view this bill.'));
        }

        next();

    }

    public ensureUserCanRemoveParticipant: RequestHandler = (req, res, next) => {

        const user: IUser = req.user;
        const bill = res.locals.bill;

        if (!user || !user.id) {
            next(this._resolveInvalidUserError());
        } else if (!bill) {
            next(this._resolveInvalidBillError());
        } else if (!BillBody.userIsParticipant(bill, user)) {
            next(this._resolveNotAllowedError('You are is not allowed to remove this participant');
        }

        next();

    }

    private _resolveInvalidBillError(): GenericError {
        return this._errorFactory.build(ErrorCode.UNKNOWN_ERROR, {
            message: 'No bill was provided to check permissions against.',
        });
    }

    private _resolveInvalidUserError(): GenericError {
        return this._errorFactory.build(ErrorCode.UNKNOWN_ERROR, {
            message: 'No user was provided to check permissions for.',
        });
    }

    private _resolveNotAllowedError(message: string = 'You are not allowed to perform that action'): GenericError {
        return this._errorFactory.build(ErrorCode.INVALID_CREDENTIALS, {
            message,
        });
    }

}

export const permissionController = new PermissionController({
    errorFactory: globalErrorFactory,
});
