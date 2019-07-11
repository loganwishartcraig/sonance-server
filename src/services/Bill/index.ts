import { IBillBody, INewBillBodyConfig } from '../../models';
import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '../Database';

export interface IBillService extends IDatabaseService<IBillBody, INewBillBodyConfig> {
    getByCreatorId(userId: string): Promise<IBillBody[]>;
    getById(billId: string): Promise<IBillBody | void>;
}
export type IBillServiceConfig = IDatabaseServiceConfig<IBillBody>;

export class BillService
    extends DatabaseService<IBillBody, INewBillBodyConfig>
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

}
