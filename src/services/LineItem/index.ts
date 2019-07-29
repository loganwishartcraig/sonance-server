import { ErrorFactoryBase } from '@common/ErrorFactory';
import { GenericError } from '@common/GenericError';
import { ErrorCode } from '@constants/error_codes';
import { IBillDocument, ILineItemConfig, ILineItemDocument, ILineItemUpdate, IUser } from '@models';
import { Types } from 'mongoose';

export interface ILineItemService {
    getAll(bill: IBillDocument): Promise<ILineItemDocument[]>;
    getById(bill: IBillDocument, id: string): Promise<ILineItemDocument | void>;
    deleteById(bill: IBillDocument, id: string): Promise<void>;
    create(bill: IBillDocument, config: ILineItemConfig[]): Promise<ILineItemDocument[]>;
    updateById(
        bill: IBillDocument,
        id: string,
        updates: ILineItemUpdate
    ): Promise<ILineItemDocument>;
    split(bill: IBillDocument, id: string, ways: number): Promise<ILineItemDocument[]>;
    claim(bill: IBillDocument, id: string, user: IUser): Promise<ILineItemDocument>;
    release(bill: IBillDocument, id: string): Promise<ILineItemDocument>;
}

export interface ILineItemServiceConfig {
    errorFactory: ErrorFactoryBase;
}

export class LineItemService implements ILineItemService {

    private readonly _errorFactory: ErrorFactoryBase;

    constructor(config: ILineItemServiceConfig) {
        this._errorFactory = config.errorFactory;
    }

    public async getAll(bill: IBillDocument): Promise<ILineItemDocument[]> {
        return bill.lines;
    }

    public async getById(bill: IBillDocument, id: string): Promise<ILineItemDocument | void> {
        return bill.lines.id(id);
    }

    public async deleteById(bill: IBillDocument, id: string): Promise<void> {
        bill.lines.id(id).remove();
    }

    public async create(bill: IBillDocument, configs: ILineItemConfig[]): Promise<ILineItemDocument[]> {

        const sliceStart = bill.lines.length;

        bill.lines.push(...configs);

        const lines = bill.lines.slice(sliceStart);

        return lines;

    }

    public async updateById(
        bill: IBillDocument,
        id: string,
        updates: ILineItemUpdate
    ): Promise<ILineItemDocument> {

        const line = bill.lines.id(id);

        if (!line) {
            throw this._buildLineNotFoundError(bill._id, id);
        }

        const updated = Object.assign(line, updates);

        return updated;

    }

    public async split(bill: IBillDocument, id: string, ways: number): Promise<ILineItemDocument[]> {

        const line = bill.lines.id(id);

        if (!line) throw this._buildLineNotFoundError(bill._id, id);

        // // TODO: Determine how to better implement this
        const rawSplit = line.price / ways;
        const splitPrice = Math.round(rawSplit * 100) / 100;
        const lastPenny = (rawSplit > splitPrice) ? 0.01 : 0;

        const configs: ILineItemConfig[] = [];
        const newConfig = this._lineToConfig(line);

        for (let i = 1; i <= ways; i++) {
            configs.push({
                ...newConfig,
                price: (i === ways) ? splitPrice + lastPenny : splitPrice,
            });
        }

        await this.deleteById(bill, id);

        return this.create(bill, configs);

    }

    public async claim(bill: IBillDocument, id: string, user: IUser): Promise<ILineItemDocument> {

        const line = await this._loadLineById(bill, id);

        if (line.claimedBy) throw this._buildLineAlreadyClaimedError(bill._id, id);

        const updates = this._buildClaimPayload(user);
        Object.assign(line, updates);

        return line;

    }

    public async release(bill: IBillDocument, id: string): Promise<ILineItemDocument> {

        const line = await this._loadLineById(bill, id);

        const updates = this._buildClaimPayload();
        Object.assign(line, updates);

        return line;

    }

    private async _loadLineById(bill: IBillDocument, id: string): Promise<ILineItemDocument> {

        const line = bill.lines.id(id);

        if (!line) throw this._buildLineNotFoundError(bill.id, id);

        return line;

    }

    private _lineToConfig(line: ILineItemDocument): ILineItemConfig {
        return {
            createdBy: line.createdBy.toHexString(),
            claimedBy: (line.claimedBy) ? line.claimedBy.toHexString() : undefined,
            claimedOn: line.claimedOn,
            deletedOn: line.deletedOn,
            isShared: line.isShared,
            price: line.price,
            quantity: line.quantity,
        };
    }

    private _buildLineNotFoundError(billId: Types.ObjectId, lineId: string): GenericError {
        return this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
            message: 'A line item with the provided id could not be found.',
            meta: { lineId, billId },
        });
    }

    private _buildLineAlreadyClaimedError(billId: Types.ObjectId, lineId: string): GenericError {
        return this._errorFactory.build(ErrorCode.REQUEST_REJECTED, {
            message: 'The specified line item is already claimed',
            meta: { lineId, billId },
        });
    }

    private _buildClaimPayload(user?: IUser): Pick<ILineItemConfig, 'claimedBy' | 'claimedOn'> {
        return {
            claimedBy: user ? user.id : undefined,
            claimedOn: user ? new Date() : undefined,
        };
    }
}
