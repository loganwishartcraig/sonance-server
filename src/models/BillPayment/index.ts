import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { IUser } from '@models/User';
import { BillPaymentSchema } from '@schemas';
import { Document, Model, Types } from 'mongoose';

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

