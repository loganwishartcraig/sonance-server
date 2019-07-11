import { RequestHandler } from 'express';
import { wrapCatch } from '../../common/Utilities';
import { billService, IBillService } from '../../services';
import { INewBillBodyConfig } from '../../models/BillBody';
import { IUser } from '../../models';
import { GenericError } from '../../common/GenericError';
import { AuthenticationErrorCode, DatabaseServiceErrorCode } from '../../constants/error_codes';

export interface ICreateBillBody {
    bill: INewBillBodyConfig;
}

class BillController {

    private _billService: IBillService;

    constructor(billService: IBillService) {
        this._billService = billService;
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
            throw new GenericError({
                code: DatabaseServiceErrorCode.RECORD_NOT_FOUND,
                message: 'A bill with the given ID could not be found.',
                httpStatus: 404,
            });
        } else if (!bill.createdBy.equals((req.user as IUser)._id)) {
            throw new GenericError({
                code: AuthenticationErrorCode.NOT_AUTHORIZED,
                message: 'You are not authorized to view this bill',
                httpStatus: 401,
            });
        }

        return res.status(200).json({ bill });

    });

    public createBill: RequestHandler = wrapCatch(async (req, res) => {

        const { bill: billConfig } = req.body;
        const bill = await this._billService.insert(billConfig);

        return res.json({ bill });

    });

}

const billController = new BillController(billService);

export default billController;
