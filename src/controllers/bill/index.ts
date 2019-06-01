import { RequestHandler } from 'express';
import { wrapCatch } from '../../common/Utilities';
import { INewBillConfig } from '../../models/Bill';
import { ICreateBillableItem } from '../../models/BillableItem';
import { ICreateBillParticipant } from '../../models/BillParticipant';
import { billService, IBillService } from '../../services';

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
                items: this._sanitizeCreateBillRequestBillableItems(bill.items),
                participants: this._sanitizeCreateBillRequestParticipants(bill.participants),
            },
        };
    }

    private _sanitizeCreateBillRequestBillableItems(items: any[] = []): ICreateBillableItem[] {

        return items.map(item => ({
            amount: item.amount,
            name: item.name,
        } as ICreateBillableItem));

    }

    private _sanitizeCreateBillRequestParticipants(participants: any[] = []): ICreateBillParticipant[] {

        return participants.map(item => ({
            memberId: item.memberId,
        } as ICreateBillParticipant));

    }

}

const billController = new BillController(billService);

export default billController;
