import { ErrorFactoryBase, globalErrorFactory } from '@common/ErrorFactory';
import { wrapCatch } from '@common/Utilities';
import { ErrorCode } from '@constants/error_codes';
import { BillBody, IBillBodyConfig, IUser } from '@models';
import { INewBillBodyRequest } from '@routes/api';
import { billService, IBillService } from '@services';
import { RequestHandler } from 'express';

class BillController {

    private _billService: IBillService;
    private _errorFactory: ErrorFactoryBase;

    constructor(
        billService: IBillService,
        errorFactory: ErrorFactoryBase
    ) {
        this._billService = billService;
        this._errorFactory = errorFactory;
    }

    public getAllForUser: RequestHandler = wrapCatch(async (req, res) => {

        const { query: { userId } } = req;
        const bills = await this._billService.getByCreatorId(userId);

        return res.json({ bills });

    });

    public getByIdForUser: RequestHandler = wrapCatch(async (req, res) => {

        const { params: { billId } } = req;
        const bill = await this._billService.getById(billId);

        if (!bill) {
            throw this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
                message: 'A bill with the given ID could not be found.',
                meta: { billId },
            });
        } else if (!BillBody.CreatedByUser(bill, req.user)) {
            throw this._errorFactory.build(ErrorCode.NOT_AUTHORIZED);
        }

        return res.status(200).json({ bill });

    });

    public deleteByIdForUser: RequestHandler = wrapCatch(async (req, res) => {

        const { params: { billId } } = req;

        const existing = await this._billService.getById(billId);

        if (!existing) {
            throw this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND);
        } else if (!BillBody.CreatedByUser(existing, req.user)) {
            throw this._errorFactory.build(ErrorCode.NOT_AUTHORIZED);
        }

        await this._billService.removeById(billId);

        return res.sendStatus(204);
    });

    public createBill: RequestHandler = wrapCatch(async (req, res) => {

        const billConfig = this._resolveBillConfig(req.body, req.user);
        const bill = await this._billService.insert(billConfig);

        return res.status(201).json({ bill });

    });

    private _resolveBillConfig({ bill }: INewBillBodyRequest, user: IUser): IBillBodyConfig {
        return {
            lines: [] as any,
            participants: [] as any,
            ...bill,
            createdBy: user._id,
        };

    }

}

export const billController = new BillController(
    billService,
    globalErrorFactory
);
