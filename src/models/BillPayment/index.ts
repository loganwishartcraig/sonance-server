import { Connection, Document, Model } from 'mongoose';
import { BillPaymentSchema } from '../../schemas';
import { IUser } from '../User';

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

export const BILL_PAYMENT_MODEL_NAME = 'BillPayment' as const;

export const billPaymentModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IBillPayment>>(BILL_PAYMENT_MODEL_NAME, BillPaymentSchema);

