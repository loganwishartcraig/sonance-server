import { ErrorFactoryBase, globalErrorFactory as errorFactory } from '@common/ErrorFactory';
import { GenericError } from '@common/GenericError';
import { IResponseLocals } from '@common/types';
import { wrapCatch } from '@common/Utilities';
import { ErrorCode } from '@constants/error_codes';
import { IBillConfig, ILineItemConfig, IUser } from '@models';
import { INewBillBodyRequest, ICreateLineItemRequest } from '@routes/api';
import {
    participantService,
    billService,
    IParticipantService,
    IBillService,
    lineItemService,
    ILineItemService
} from '@services';
import { RequestHandler } from 'express';
import { Request, Response } from 'express-serve-static-core';
import { Types } from 'mongoose';
import { extractLocalResponseValue } from '@common/RequestHelpers';

export interface IBillControllerConfig {
    billService: IBillService;
    participantService: IParticipantService;
    lineItemService: ILineItemService;
    errorFactory: ErrorFactoryBase;
}

class BillController {

    private _billService: IBillService;
    private _participantService: IParticipantService;
    private _lineItemService: ILineItemService;
    private _errorFactory: ErrorFactoryBase;

    constructor(config: IBillControllerConfig) {
        this._billService = config.billService;
        this._participantService = config.participantService;
        this._lineItemService = config.lineItemService;
        this._errorFactory = config.errorFactory;
    }

    public loadBillById = (
        idAccessor: (req: Request) => string = ({ params: { billId } }) => billId
    ): RequestHandler => wrapCatch(async (req, res, next) => {

        const billId = idAccessor(req);
        const bill = await this._billService.getById(billId);

        if (!bill) {
            throw this._buildBillNotFoundError(billId);
        }

        res.locals.bill = bill;

        next();

    })

    public loadBillsForUser = (
        idAccessor: (req: Request) => string = ({ query: { userId } }) => userId
    ): RequestHandler => wrapCatch(async (req, res, next) => {

        const userId = idAccessor(req);

        (res.locals as IResponseLocals).bills = await this._billService.getByCreatorId(userId);

        next();

    })

    public saveBill: RequestHandler = wrapCatch(async (req, res, next) => {

        const bill = extractLocalResponseValue(res, 'bill');

        await this._billService.save(bill);

        next();

    });

    public loadAllLinesForBill: RequestHandler = wrapCatch(async (req, res, next) => {

        const bill = extractLocalResponseValue(res, 'bill');

        (res.locals as IResponseLocals).lines = await this._lineItemService.getAll(bill);

        next();

    });

    public loadLineById = (
        idAccessor: (req: Request) => string = ({ params: { lineId } }) => lineId
    ): RequestHandler => wrapCatch(async (req, res, next) => {

        const lineId = idAccessor(req);
        const bill = extractLocalResponseValue(res, 'bill');

        console.log('test', { lineId, bill });

        const line = await this._lineItemService.getById(bill, lineId);

        if (!line) {
            throw this._buildLineItemNotFoundError(bill._id, lineId);
        }

        (res.locals as IResponseLocals).line = line;

        next();

    })

    public deleteBillById = (
        idAccessor: (req: Request) => string = ({ params: { billId } }) => billId
    ): RequestHandler => wrapCatch(async (req, res, next) => {

        const billId = idAccessor(req);

        await this._billService.removeById(billId);

        next();

    })

    public deleteLineById = (
        idAccessor: (req: Request) => string = ({ params: { lineId } }) => lineId
    ): RequestHandler => wrapCatch(async (req, res, next) => {

        const { locals: { bill } } = res;
        const lineId = idAccessor(req);

        await this._lineItemService.deleteById(bill, lineId);

        next();

    })

    public createBill: RequestHandler = wrapCatch(async (req, res, next) => {

        const billConfig = this._serializeBillConfig(req.body, req.user);

        (res.locals as IResponseLocals).bill = await this._billService.insert(billConfig);

        next();

    });

    public createLine: RequestHandler = wrapCatch(async (req, res, next) => {

        const bill = extractLocalResponseValue(res, 'bill');

        const lineConfig = this._serializeLineConfig(req.body.line, req.user);

        const [line] = await this._lineItemService.create(bill, [lineConfig]);

        (res.locals as IResponseLocals).line = line;

        next();

    });

    public splitLine: RequestHandler = wrapCatch(async (req, res, next) => {

        const { body: { ways }, params: { lineId } } = req;
        const bill = extractLocalResponseValue(res, 'bill');

        (res.locals as IResponseLocals).lines = await this._lineItemService.split(bill, lineId, ways);

        next();

    });

    public claimLine: RequestHandler = wrapCatch(async (req, res, next) => {

        const { params: { lineId }, user } = req;
        const bill = extractLocalResponseValue(res, 'bill');

        (res.locals as IResponseLocals).line = await this._lineItemService.claim(bill, lineId, user);

        next();

    });

    public releaseLine: RequestHandler = wrapCatch(async (req, res, next) => {

        const { params: { lineId } } = req;
        const bill = extractLocalResponseValue(res, 'bill');

        (res.locals as IResponseLocals).line = await this._lineItemService.release(bill, lineId);

        next();

    });

    public joinUserToBill: RequestHandler = wrapCatch(async (req, res, next) => {

        const { user } = req;
        const bill = extractLocalResponseValue(res, 'bill');

        (res.locals as IResponseLocals).participant = await this._participantService.create(bill, user);

        next();

    });

    private _serializeBillConfig(
        { bill: {
            lines = [],
            ...billConfig
        } }: INewBillBodyRequest,
        user: IUser
    ): IBillConfig {

        // TODO: implement share codes correctly.
        // TODO: Extract serialization to validation layer

        return {
            ...billConfig,
            shareCode: 'XXXXXX',
            lines: lines.map(line => this._serializeLineConfig(line, user)),
            participants: [],
            createdBy: user.id,
        };
    }

    private _serializeLineConfig(config: ICreateLineItemRequest['line'], user: IUser): ILineItemConfig {
        // TODO: Extract serialization to validation layer
        return {
            createdBy: user.id,
            claimedBy: config.isClaimed ? user.id : undefined,
            claimedOn: config.isClaimed ? new Date() : undefined,
            isShared: !!config.isShared,
            price: config.price,
            quantity: config.quantity,
            deletedOn: undefined,
        };
    }

    private _buildBillNotFoundError(billId: string): GenericError {
        return this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
            message: 'The requested bill could not be found.',
            meta: { billId },
        });
    }

    private _buildLineItemNotFoundError(billId: Types.ObjectId, lineId: string): GenericError {
        return this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
            message: 'The requested line item could not be found.',
            meta: { billId, lineId },
        });
    }

}

export const billController = new BillController({
    billService,
    participantService,
    lineItemService,
    errorFactory,
});
