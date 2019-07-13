import { Document, Model, Types } from 'mongoose';
import { ModelName } from '../../constants/model_names';
import { BillPaymentSchema } from '../../schemas';
import { ModelFactory } from '../types';
import { IUser } from '../User';

export enum BillPaymentMethod {
    PAYPAL,
}

export interface IBillPayment {
    readonly _id: Types.ObjectId;
    readonly paidBy: IUser;
    readonly paidTo: IUser;
    readonly paidOn: Date;
    readonly amount: number;
    readonly method: BillPaymentMethod;
}

export type IBillPaymentConfig = Omit<IBillPayment, '_id'>;

export const billPaymentModelFactory: ModelFactory<IBillPayment> = connection =>
    connection.model<Document, Model<Document, IBillPayment>>(ModelName.BILL_PAYMENT, BillPaymentSchema);

