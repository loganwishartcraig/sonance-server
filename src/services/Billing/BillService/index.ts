import { DatabaseService, IDatabaseService } from '../../Database';
import { IBill, buildBillModel, INewBillConfig } from '../../../models/Bill';
import { Connection } from 'mongoose';

export interface IBillService extends IDatabaseService<IBill, INewBillConfig> {
    getByCreatorId(userId: string): Promise<IBill[]>;
}

export interface IBillCreate {
    readonly createdBy: string;
    readonly totalAmount: number;
    readonly name?: string;
}

export class BillService extends DatabaseService<IBill, INewBillConfig> implements IBillService {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: buildBillModel,
        });
    }

    public async getByCreatorId(userId: string): Promise<IBill[]> {
        return this.find({ createdBy: userId });
    }

}
