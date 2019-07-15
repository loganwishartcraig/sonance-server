import { IDatabaseService, IDatabaseServiceConfig, DatabaseService } from '@services/Database';
import { IBillBody, IBillBodyConfig, IBillLineItemConfig, IBillLineItem } from '@models';
import { Types } from 'mongoose';
import { ErrorCode } from '@constants/error_codes';
import { types } from 'node-sass';

export interface IBillService extends IDatabaseService<IBillBody, IBillBodyConfig> {
    getByCreatorId(userId: string): Promise<IBillBody[]>;
    getById(billId: string): Promise<IBillBody | void>;
    removeById(billId: string | Types.ObjectId): Promise<void>;
    insertLine(billId: string | Types.ObjectId, config: IBillLineItemConfig): Promise<IBillLineItem>;
    removeLineById(billId: string | Types.ObjectId, lineId: string | Types.ObjectId): Promise<void>;
}
export type IBillServiceConfig = IDatabaseServiceConfig<IBillBody>;

export class BillService
    extends DatabaseService<IBillBody, IBillBodyConfig>
    implements IBillService {

    constructor(config: IBillServiceConfig) {
        super(config);
    }

    public async getByCreatorId(userId: string): Promise<IBillBody[]> {
        // TODO: Resolve this any cast issue
        return this.find({ createdBy: userId as any });
    }

    public async getById(billId: string): Promise<IBillBody | void> {
        return this.findOne({ _id: billId as any });
    }

    public async removeById(billId: string | Types.ObjectId): Promise<void> {
        return this.removeOne({ _id: billId as any });
    }

    public async insertLine(billId: string | Types.ObjectId, config: IBillLineItemConfig): Promise<IBillLineItem> {

        const bill = await this.loadOneRaw({ _id: billId });

        if (!bill) {
            throw this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND);
        }

        (bill as any).lines.push(config);

        const line = (bill as any).lines[(bill as any).lines.length - 1];

        await bill.save();

        return line;

    }

    public async removeLineById(billId: string | Types.ObjectId, lineId: string | Types.ObjectId): Promise<void> {

        const bill = await this.loadOneRaw({ _id: billId });

        if (!bill) {
            throw this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND);
        }

        (bill as any).lines.id(lineId).remove();

        await bill.save();

    }

}
