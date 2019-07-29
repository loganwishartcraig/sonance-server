import { ErrorFactoryBase, globalErrorFactory } from '@common/ErrorFactory';
import { GenericError } from '@common/GenericError';
import { IResponseLocals } from '@common/types';
import { wrapCatch } from '@common/Utilities';
import { ErrorCode } from '@constants/error_codes';
import { IBillConfig, ILineItemConfig, IUser } from '@models';
import { INewBillBodyRequest, INewBillLineItemRequest } from '@routes/api';
import {
    billParticipantService,
    billService,
    IBillParticipantService,
    IBillService,
    billLineItemService
} from '@services';
import { IBillLineItemService } from '@services/BillLineItem';
import { RequestHandler } from 'express';
import { Request, Response } from 'express-serve-static-core';

export interface IBillControllerConfig {
    billService: IBillService;
    participantService: IBillParticipantService;
    billLineItemService: IBillLineItemService;
    errorFactory: ErrorFactoryBase;
}

class BillController {

    private _billService: IBillService;
    private _billParticipantService: IBillParticipantService;
    private _billLineItemService: IBillLineItemService;
    private _errorFactory: ErrorFactoryBase;

    constructor(config: IBillControllerConfig) {
        this._billService = config.billService;
        this._billParticipantService = config.participantService;
        this._billLineItemService = config.billLineItemService;
        this._errorFactory = config.errorFactory;
    }

    public loadBillById = (
        idAccessor: (req: Request) => string = ({ params: { billId } }) => billId
    ): RequestHandler => wrapCatch(async (req, res, next) => {

        const billId = idAccessor(req);
        const bill = await this._billService.loadOneRaw({ _id: billId });

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

        const bill = this._extractLocalValue(res, 'bill');

        await this._billService.save(bill);

        next();

    });

    public loadAllLines: RequestHandler = wrapCatch(async (req, res, next) => {

        const bill = this._extractLocalValue(res, 'bill');

        (res.locals as IResponseLocals).lines = await this._billLineItemService.getAll(bill);

        next();

    });

    public loadLineById = (
        idAccessor: (req: Request) => string = ({ params: { lineId } }) => lineId
    ): RequestHandler => wrapCatch(async (req, res, next) => {

        const lineId = idAccessor(req);
        const bill = this._extractLocalValue(res, 'bill');

        const line = await this._billLineItemService.getById(bill, lineId);

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

        await this._billLineItemService.deleteById(bill, lineId);

        next();

    })

    public createBill: RequestHandler = wrapCatch(async (req, res, next) => {

        const billConfig = this._serializeBillConfig(req.body, req.user);

        (res.locals as IResponseLocals).bill = await this._billService.insert(billConfig);

        next();

    });

    public createLine: RequestHandler = wrapCatch(async (req, res, next) => {

        const bill = this._extractLocalValue(res, 'bill');

        const lineConfig = this._serializeLineConfig(req.body.line, req.user);

        const [line] = await this._billLineItemService.create(bill._id, [lineConfig]);

        (res.locals as IResponseLocals).line = line;

        next();

    });

    public splitLine: RequestHandler = wrapCatch(async (req, res, next) => {

        const { body: { ways }, params: { lineId } } = req;
        const bill = this._extractLocalValue(res, 'bill');

        (res.locals as IResponseLocals).lines = await this._billLineItemService.split(bill, lineId, ways);

        next();

    });

    public claimLine: RequestHandler = wrapCatch(async (req, res, next) => {

        const { params: { lineId }, user } = req;
        const bill = this._extractLocalValue(res, 'bill');

        (res.locals as IResponseLocals).line = await this._billLineItemService.claim(bill, lineId, user);

        next();

    });

    public releaseLine: RequestHandler = wrapCatch(async (req, res, next) => {

        const { params: { lineId } } = req;
        const bill = this._extractLocalValue(res, 'bill');

        (res.locals as IResponseLocals).lineUpdates = await this._billLineItemService.release(bill, lineId);

        next();

    });

    public joinUserToBill: RequestHandler = wrapCatch(async (req, res, next) => {

        const { user } = req;
        const bill = this._extractLocalValue(res, 'bill');

        (res.locals as IResponseLocals).participant = await this._billParticipantService.create(bill, user);
        next();

    });

    private _extractLocalValue<T extends keyof IResponseLocals>(res: Response, key: T): Required<IResponseLocals>[T] {

        const value = res.locals[key];

        if (value == null) {
            throw this._buildLocalNotProvidedError(key);
        }

        return value;

    }

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
            createdBy: user._id,
        };
    }

    private _serializeLineConfig(config: INewBillLineItemRequest['line'], user: IUser): ILineItemConfig {
        // TODO: Extract serialization to validation layer
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

    private _buildBillNotFoundError(billId: string): GenericError {
        return this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
            message: 'The requested bill could not be found.',
            meta: { billId },
        });
    }

    private _buildLocalNotProvidedError(key: keyof IResponseLocals, meta: any = {}): GenericError {

        const recType = this._resolveLocalPropRecTypeString(key);

        return this._errorFactory.build(ErrorCode.INTERNAL_ERROR, {
            meta,
            message: `The ${recType} was not properly loaded on the server.`,
        });

    }

    private _resolveLocalPropRecTypeString(key: keyof IResponseLocals): string {

        switch (key) {
            case 'bill':
            case 'bills':
            case 'billUpdates':
                return 'bill';
            case 'line':
            case 'lines':
            case 'lineUpdates':
                return 'line';
            case 'participant':
            case 'participants':
            case 'participantUpdates':
                return 'participant';
            default:
                return 'record';
        }

    }

    private _buildLineItemNotFoundError(billId: string, lineId: string): GenericError {
        return this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
            message: 'The requested line item could not be found.',
            meta: { billId, lineId },
        });
    }

}

export const billController = new BillController({
    billService,
    billLineItemService,
    errorFactory: globalErrorFactory,
    participantService: billParticipantService,
});
