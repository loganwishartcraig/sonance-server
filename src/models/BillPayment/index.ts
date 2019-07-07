import { Connection, Document, Model } from 'mongoose';
import { BillPaymentSchema } from '../../schemas';
import { IUser } from '../User';
import { ModelName } from '../../constants/model_names';

export enum BillPaymentMethod {
    PAYPAL,
}

export interface IBillPayment {
    readonly _id: string;
    readonly paidBy: IUser;
    readonly paidTo: IUser;
    readonly paidOn: Date;
    readonly amount: number;
    readonly method: BillPaymentMethod;
}

export type INewBillPayment = Omit<IBillPayment, '_id'>;

export const billPaymentModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IBillPayment>>(ModelName.BILL_PAYMENT, BillPaymentSchema);

