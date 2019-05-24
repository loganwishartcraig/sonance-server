import { IDatabaseService, DatabaseService } from '../Database';
import { IPayment, INewPaymentConfig, buildPaymentModel } from '../../models/Payment';
import { Connection } from 'mongoose';

export interface IPaymentService extends IDatabaseService<IPayment, INewPaymentConfig> {
    getBySenderId(userId: string): Promise<IPayment[]>;
    getByRecipientId(userId: string): Promise<IPayment[]>;
}

export class PaymentService extends DatabaseService<IPayment, INewPaymentConfig> implements IPaymentService {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: buildPaymentModel,
        });
    }

    public async getBySenderId(userId: string): Promise<IPayment[]> {
        return this.find({ sender: userId });
    }

    public async getByRecipientId(userId: string): Promise<IPayment[]> {
        return this.find({ recipient: userId });
    }

}
