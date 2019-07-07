import { Connection } from 'mongoose';
import modelFactory, { IBillBody, INewBillBodyConfig } from '../../models/BillBody';
import { DatabaseService, IDatabaseService } from '../Database';

export interface IBillService extends IDatabaseService<IBillBody, INewBillBodyConfig> {
    getByCreatorId(userId: string): Promise<IBillBody[]>;
}
export class BillService
    extends DatabaseService<IBillBody, INewBillBodyConfig>
    implements IBillService {

    constructor(connection: Connection) {
        super({ connection, modelFactory, });
    }

    public async getByCreatorId(userId: string): Promise<IBillBody[]> {
        return this.find({ createdBy: userId as any });
    }

}
