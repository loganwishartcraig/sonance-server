import { billService, IBillService } from '../../services';
import { RequestHandler } from 'express';
import { wrapCatch } from '../../common/Utilities';
import { INewBillConfig } from '../../models/Bill';

export interface ICreateBillBody {
    bill: INewBillConfig;
}

class BillController {

    private _billService: IBillService;

    constructor(billService: IBillService) {
        this._billService = billService;
    }

    public getAllForUser: RequestHandler = wrapCatch(async (req, res, next) => {

        const { query: { user: userId } } = req;

        const bills = await this._billService.getByCreatorId(userId);

        return res.status(200).json({ bills });

    });

    public createBill: RequestHandler = wrapCatch(async (req, res) => {

        const { bill: billConfig } = this._sanitizeCreateBillRequestBody(req.body);

        console.warn('creating bill!!', billConfig);

        const bill = await this._billService.insert(billConfig);

        return res.status(200).json({ bill });

    });

    private _sanitizeCreateBillRequestBody({ bill = {} }: any): ICreateBillBody {

        return {
            bill: {
                createdBy: bill.createdBy,
                totalAmount: bill.totalAmount,
                name: bill.name,
            },
        };
    }

}

const billController = new BillController(billService);

export default billController;
