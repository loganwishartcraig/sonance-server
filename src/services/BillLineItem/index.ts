import { IDatabaseServiceRaw } from '@services/Database';
import { IBillBody, IBillLineItem, IBillLineItemConfig } from '@models';
import { ErrorFactoryBase, globalErrorFactory } from '@common/ErrorFactory';
import { Document } from 'mongoose';
import { IBillService } from '@services/Bill';

export interface INewLineItemRequest {
    quantity: number;
    price: number;
    isClaimed?: boolean;
    isShared?: boolean;
}

export interface IBillLineItemService {
    getAllForBill(): Promise<IBillLineItem[]>;
    getAllById(id: string): Promise<IBillLineItem | void>;
    deleteById(id: string): Promise<void>;
    create(config: INewLineItemRequest): Promise<IBillLineItem>;
    split(id: string, ways: number): Promise<IBillLineItem[]>;

    // should really be static, but can't do that in typescript interfaces
    resolveConfigFromRequest(config: INewLineItemRequest): IBillLineItemConfig;
}

export interface IBillLineItemServiceConfig {
    bill: Document;
    errorFactory: ErrorFactoryBase;
}

export interface IBillLineItemServiceFactory {
    buildFromId(billId: string): Promise<IBillLineItemService>;
}

export interface IBillLineItemServiceFactoryConfig {
    billService: IDatabaseServiceRaw<IBillBody>;
    errorFactory: ErrorFactoryBase;
}

export class BillLineItemServiceFactory {

    private readonly _billService: IDatabaseServiceRaw<IBillBody>;
    private readonly _errorFactory: ErrorFactoryBase;

    constructor({
        billService,
        errorFactory,
    }: IBillLineItemServiceFactoryConfig) {
        this._billService = billService;
        this._errorFactory = errorFactory;
    }

    public async buildFromId(billId: string): Promise<IBillLineItemService> {

        const bill = await this._billService.loadOneRaw({ _id: billId });

        if (bill) {
            return new BillLineItemService({ bill, errorFactory: this._errorFactory });
        }

        // if (!bill) throw new Err

    }

}

export default class BillLineItemService implements IBillLineItemService {

    private readonly _bill: Document;
    private readonly _errorFactory: ErrorFactoryBase;

    constructor(config: IBillLineItemServiceConfig) {
        this._bill = config.bill;
        this._errorFactory = config.errorFactory;
    }

}
