import { IBill, IBIllBodyUpdateConfig, IBillDocument } from '@models';
import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '@services/Database';
import { Types } from 'mongoose';

export interface IBillService extends IDatabaseService<IBillDocument, IBill> {
    getByCreatorId(userId: string): Promise<IBillDocument[]>;
    getById(billId: string): Promise<IBillDocument | null>;
    getByShareCode(shareCode: string): Promise<IBillDocument | null>;
    removeById(billId: string | Types.ObjectId): Promise<void>;
    updateBill(billId: string | Types.ObjectId, updates: IBIllBodyUpdateConfig): Promise<IBillDocument | null>;
}
export type IBillServiceConfig = IDatabaseServiceConfig<IBillDocument>;

export class BillService
    extends DatabaseService<IBillDocument, IBill>
    implements IBillService {

    constructor(config: IBillServiceConfig) {
        super(config);
    }

    public async getByCreatorId(userId: string): Promise<IBillDocument[]> {
        return this.find({ createdBy: userId });
    }

    public async getById(billId: string): Promise<IBillDocument | null> {
        return this.findOne({ _id: billId });
    }

    public async getByShareCode(shareCode: string): Promise<IBillDocument | null> {
        return this.findOne({ shareCode });
    }

    public async removeById(billId: string | Types.ObjectId): Promise<void> {
        return this.removeOne({ _id: billId });
    }

    public async updateBill(
        billId: string | Types.ObjectId,
        updates: IBIllBodyUpdateConfig
    ): Promise<IBillDocument | null> {
        return await this.updateOne({ _id: billId }, updates);
    }

}
