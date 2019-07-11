import { RequestHandler } from 'express';
import { ErrorFactoryBase, globalErrorFactory } from '../../common/ErrorFactory';
import { wrapCatch } from '../../common/Utilities';
import { ErrorCode } from '../../constants/error_codes';
import { IUser } from '../../models';
import { INewBillBodyConfig } from '../../models/BillBody';
import { billService, IBillService } from '../../services';

export interface ICreateBillBody {
    bill: INewBillBodyConfig;
}

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
        } else if (!bill.createdBy.equals((req.user as IUser)._id)) {
            throw this._errorFactory.build(ErrorCode.NOT_AUTHORIZED);
        }

        return res.status(200).json({ bill });

    });

    public createBill: RequestHandler = wrapCatch(async (req, res) => {

        const { bill: billConfig } = req.body;
        const bill = await this._billService.insert(billConfig);

        return res.json({ bill });

    });

}

const billController = new BillController(
    billService,
    globalErrorFactory
);

export default billController;
