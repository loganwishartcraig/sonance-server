import { ErrorFactoryBase } from '@common/ErrorFactory';
import { GenericError } from '@common/GenericError';
import { IBillLineItem, IBillLineItemConfig, IBIllLineItemUpdateConfig, IUser } from '@models';
import { Document } from 'mongoose';
import { ErrorCode } from '@constants/error_codes';

export interface IBillLineItemService {
    getAll(bill: Document): Promise<IBillLineItem[]>;
    getById(bill: Document, id: string): Promise<IBillLineItem | void>;
    deleteById(bill: Document, id: string): Promise<void>;
    create(bill: Document, config: IBillLineItemConfig[]): Promise<IBillLineItem[]>;
    updateById(
        bill: Document,
        id: string,
        updates: IBIllLineItemUpdateConfig
    ): Promise<IBillLineItem | void>;
    split(bill: Document, id: string, ways: number): Promise<IBillLineItem[]>;
    claim(bill: Document, id: string, user: IUser): Promise<IBillLineItem>;
    release(bill: Document, id: string): Promise<IBillLineItem>;
}

export interface IBillLineItemServiceConfig {
    errorFactory: ErrorFactoryBase;
}

export class BillLineItemService implements IBillLineItemService {

    private readonly _errorFactory: ErrorFactoryBase;

    constructor(config: IBillLineItemServiceConfig) {
        this._errorFactory = config.errorFactory;
    }

    public async getAll(bill: Document): Promise<IBillLineItem[]> {
        return (bill as any).lines;
    }

    public async getById(bill: Document, id: string): Promise<IBillLineItem | void> {
        return (bill as any).lines.id(id);
    }

    public async deleteById(bill: Document, id: string): Promise<void> {

        (bill as any).lines.id(id).remove();

        await bill.save();

    }

    public async create(bill: Document, configs: IBillLineItemConfig[]): Promise<IBillLineItem[]> {

        const sliceStart = (bill as any).lines.length;

        (bill as any).lines.push(...configs);

        const lines = (bill as any).lines.slice(sliceStart);

        await bill.save();

        return lines;

    }

    public async updateById(
        bill: Document,
        id: string,
        updates: IBIllLineItemUpdateConfig
    ): Promise<IBillLineItem | void> {

        const line = (bill as any).lines.id(id);

        if (!line) {
            throw this._buildLineNotFoundError(bill._id, id);
        }

        const updated = Object.assign(line, updates);

        await bill.save();

        return updated;

    }

    public async split(bill: Document, id: string, ways: number): Promise<IBillLineItem[]> {

        const line = (bill as any).lines.id(id);

        if (!line) throw this._buildLineNotFoundError(bill._id, id);

        // // TODO: Determine how to better implement this
        const splitPrice: number = line.price / ways;

        const configs: IBillLineItemConfig[] = [];
        const newConfig = this._lineToConfig(line);

        for (let i = 0; i < ways; i++) {
            configs.push({ ...newConfig, price: splitPrice });
        }

        await this.deleteById(bill, id);

        return this.create(bill, configs);

    }

    public async claim(bill: Document, id: string, user: IUser): Promise<IBillLineItem> {

        const line = await this._loadLineById(bill, id);

        if (line.claimedBy) throw this._buildLineAlreadyClaimedError(bill._id, id);

        const updates = this._buildClaimPayload(user);
        Object.assign(line, updates);

        await bill.save();

        return line;

    }

    public async release(bill: Document, id: string): Promise<IBillLineItem> {

        const line = await this._loadLineById(bill, id);

        const updates = this._buildClaimPayload();
        Object.assign(line, updates);

        await bill.save();

        return line;

    }

    private async _loadLineById(bill: Document, id: string): Promise<IBillLineItem> {

        const line = (bill as any).lines.id(id);

        if (!line) throw this._buildLineNotFoundError(bill.id, id);

        return line;

    }

    private _lineToConfig({ _id, ...lineConfig }: IBillLineItem): IBillLineItemConfig {
        return lineConfig;
    }

    private _buildLineNotFoundError(billId: string, lineId: string): GenericError {
        return this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
            message: 'A line item with the provided id could not be found.',
            meta: { lineId, billId },
        });
    }

    private _buildLineAlreadyClaimedError(billId: string, lineId: string): GenericError {
        return this._errorFactory.build(ErrorCode.REQUEST_REJECTED, {
            message: 'The specified line item is already claimed',
            meta: { lineId, billId },
        });
    }

    private _buildClaimPayload(user?: IUser): Pick<IBillLineItem, 'claimedBy' | 'claimedOn'> {
        return {
            claimedBy: user ? user._id : undefined,
            claimedOn: user ? new Date() : undefined,
        };
    }
}
