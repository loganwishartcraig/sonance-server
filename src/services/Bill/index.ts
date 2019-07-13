import { IBillBody, IBillBodyConfig, IBillLineItem } from '../../models';
import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '../Database';

export interface IBillService extends IDatabaseService<IBillBody, IBillBodyConfig> {
    getByCreatorId(userId: string): Promise<IBillBody[]>;
    getById(billId: string): Promise<IBillBody | void>;
    removeById(billId: string): Promise<void>;
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

    public async removeById(billId: string): Promise<void> {
        return this.removeOne({ _id: billId as any });
    }

}
