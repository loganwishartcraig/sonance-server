import { ErrorFactoryBase, globalErrorFactory } from '@common/ErrorFactory';
import { GenericError } from '@common/GenericError';
import { wrapCatch } from '@common/Utilities';
import { ErrorCode } from '@constants/error_codes';
import {
    BillBody,
    BillLineItem,
    IBillBody,
    IBillBodyConfig,
    IBillLineItem,
    IBillLineItemConfig,
    IBIllLineItemUpdateConfig,
    IUser
} from '@models';
import { INewBillBodyRequest, INewBillLineItemRequest } from '@routes/api';
import { billService, IBillService, IBillParticipantService, billParticipantService } from '@services';
import { RequestHandler } from 'express';

class BillController {

    private _billService: IBillService;
    private _participantService: IBillParticipantService;
    private _errorFactory: ErrorFactoryBase;

    constructor(
        billService: IBillService,
        participantService: IBillParticipantService,
        errorFactory: ErrorFactoryBase
    ) {
        this._billService = billService;
        this._participantService = participantService;
        this._errorFactory = errorFactory;
    }

    public getAllForUser: RequestHandler = wrapCatch(async (req, res) => {

        const { query: { userId } } = req;
        const bills = await this._billService.getByCreatorId(userId);

        return res.json({ bills });

    });

    public getByIdForUser: RequestHandler = wrapCatch(async (req, res) => {

        const { params: { billId } } = req;

        const bill = await this._resolveBillCreatedByUser(billId, req.user);

        return res.status(200).json({ bill });

    });

    public getAllLinesForBill: RequestHandler = wrapCatch(async (req, res) => {

        const { params: { billId } } = req;

        const { lines } = await this._resolveBillCreatedByUser(billId, req.user);

        return res.status(200).json({ lines });

    });

    public getLineForBill: RequestHandler = wrapCatch(async (req, res) => {

        const line = await this._resolveLineById(req.params, req.user);

        return res.json({ line });

    });

    public deleteByIdForUser: RequestHandler = wrapCatch(async (req, res) => {

        const { params: { billId } } = req;

        const bill = await this._resolveBillCreatedByUser(billId, req.user);

        await this._billService.removeById(bill._id);

        return res.sendStatus(204);
    });

    public deleteLineById: RequestHandler = wrapCatch(async (req, res) => {

        const line = await this._resolveLineById(req.params, req.user);

        await this._billService.removeLineById(req.params.billId, line._id);

        return res.sendStatus(204);

    });

    public createBill: RequestHandler = wrapCatch(async (req, res) => {

        const billConfig = this._serializeBillConfig(req.body, req.user);
        const bill = await this._billService.insert(billConfig);

        return res.status(201).json({ bill });

    });

    public createLineForBill: RequestHandler = wrapCatch(async (req, res) => {

        const { params: { billId } } = req;

        const bill = await this._resolveBillCreatedByUser(billId, req.user);
        const lineConfig = this._serializeLineConfig(req.body.line, req.user);

        const [line] = await this._billService.insertLines(bill._id, [lineConfig]);

        return res.json({ line });

    });

    public splitLines: RequestHandler = wrapCatch(async (req, res) => {

        const { body: { ways }, params: { billId, lineId } } = req;

        const line = await this._resolveLineById({ billId, lineId }, req.user);
        const splitLines = await BillLineItem.split(line, ways);

        await this._billService.removeLineById(billId, line._id);
        const lines = await this._billService.insertLines(billId, splitLines);

        return res.json({ lines });

    });

    public claimLine: RequestHandler = wrapCatch(async (req, res) => {

        const line = await this._resolveLineById(req.params, req.user);

        if (line.claimedBy) {
            throw this._errorFactory.build(ErrorCode.REQUEST_REJECTED, {
                message: 'The line has already been claimed.',
            });
        }

        const updates: IBIllLineItemUpdateConfig = {
            claimedBy: req.user._id.toHexString(),
            claimedOn: new Date(),
        };

        await this._billService.updateLine(req.params.billId, line._id, updates);

        return res.json({ updates });

    });

    public releaseLine: RequestHandler = wrapCatch(async (req, res) => {

        const line = await this._resolveLineById(req.params, req.user);

        const updates: IBIllLineItemUpdateConfig = {
            claimedBy: undefined,
            claimedOn: undefined,
        };

        await this._billService.updateLine(req.params.billId, line._id, updates);

        return res.json({ updates });

    });

    public joinUserToBill: RequestHandler = wrapCatch(async (req, res) => {

        const { body: { shareCode }, user } = req;

        // const bill = await this._billService.loadOneRaw({ shareCode });

        // if (!bill) {
        //     throw this._errorFactory.build(ErrorCode.INVALID_CREDENTIALS, {
        //         message: 'No bill with a matching share code could be found.',
        //         meta: { shareCode },
        //     });
        // }

        const participant = await this._participantService.addUserViaCode(shareCode, user);

        return res.json({ participant });

    });

    private _serializeBillConfig(
        { bill: {
            lines = [],
            ...billConfig
        } }: INewBillBodyRequest,
        user: IUser
    ): IBillBodyConfig {

        // TODO: implement share codes correctly.
        return {
            ...billConfig,
            shareCode: 'XXXXXX',
            lines: lines.map(line => this._serializeLineConfig(line, user)),
            participants: [this._participantService.resolveConfigForUser(user)],
            createdBy: user._id,
        };
    }

    private _serializeLineConfig(config: INewBillLineItemRequest['line'], user: IUser): IBillLineItemConfig {
        return {
            createdBy: user._id,
            claimedBy: config.isClaimed ? user._id : undefined,
            claimedOn: config.isClaimed ? new Date() : undefined,
            isShared: !!config.isShared,
            price: config.price,
            quantity: config.quantity,
            deletedOn: undefined,
        };
    }

    private async _resolveBillCreatedByUser(billId: string, user: IUser): Promise<IBillBody> {

        const bill = await this._billService.getById(billId);

        if (!bill) {
            throw this._buildBillNotFoundError(billId);
        } else if (!BillBody.createdByUser(bill, user)) {
            throw this._errorFactory.build(ErrorCode.NOT_AUTHORIZED);
        }

        return bill;

    }

    private _buildBillNotFoundError(billId: string): GenericError {
        return this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
            message: 'The requested bill could not be found.',
            meta: { billId },
        });
    }

    private _buildLineNotFoundError(billId: string, lineId: string): GenericError {
        return this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
            message: 'The requested line could not be found.',
            meta: { billId, lineId },
        });
    }

    private async _resolveLineById(
        { billId, lineId }: { billId: string, lineId: string },
        user: IUser
    ): Promise<IBillLineItem> {

        const { lines } = await this._resolveBillCreatedByUser(billId, user);

        const [line] = lines.filter(({ _id }) => _id.equals(lineId));

        if (!line) {
            throw this._buildLineNotFoundError(billId, lineId);
        }

        return line;

    }

}

export const billController = new BillController(
    billService,
    billParticipantService,
    globalErrorFactory
);
