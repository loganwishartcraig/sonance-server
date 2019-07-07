import { Connection } from 'mongoose';
import { billBodyModelFactory, IBillBody, INewBillBodyConfig } from '../../models';
import { DatabaseService, IDatabaseService } from '../Database';

export interface IBillService extends IDatabaseService<IBillBody, INewBillBodyConfig> {
    getByCreatorId(userId: string): Promise<IBillBody[]>;
}
export class BillService
    extends DatabaseService<IBillBody, INewBillBodyConfig>
    implements IBillService {

    constructor(connection: Connection) {
        super({ connection, modelFactory: billBodyModelFactory, });
    }

    public async getByCreatorId(userId: string): Promise<IBillBody[]> {
        // TODO: Resolve this any cast issue
        return this.find({ createdBy: userId as any });
    }

}
