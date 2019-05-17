import { DatabaseService, IDatabaseService } from '../../Database';
import { IBill, buildBillModel, IBillSchema, INewBillConfig } from '../../../models/Bill';
import { Connection } from 'mongoose';

export interface IBillService extends IDatabaseService {
    getByCreatorId(userId: string): Promise<IBill[]>;
}

export interface IBillCreate {
    readonly userId: string;
    readonly totalAmount: number;
    readonly name?: string;
}

export class BillService extends DatabaseService<IBill, IBillSchema> implements IBillService {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: buildBillModel,
        });
    }

    public async getByCreatorId(userId: string): Promise<IBill[]> {
        return this.find({ createdBy: userId });
    }

    protected _formatForInsert({
        userId: createdBy,
        name,
        totalAmount,
    }: IBillCreate): INewBillConfig {
        return { createdBy, totalAmount, name };
    }

}
