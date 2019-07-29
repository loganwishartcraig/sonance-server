import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { BillPaymentSchema } from '@schemas';
import { Document, Types } from 'mongoose';

export enum PaymentMethod {
    PAYPAL,
}

export interface IPayment {
    readonly id: string;
    readonly paidBy: string;
    readonly paidTo: string;
    readonly paidOn: Date;
    readonly amount: number;
    readonly method: PaymentMethod;
}

export type IPaymentConfig = Omit<IPayment, 'id'>;

export interface IPaymentDocument extends Omit<IPayment, 'id' | 'paidBy' | 'paidTo'>, Document {
    _id: Types.ObjectId;
    paidBy: Types.ObjectId;
    paidTo: Types.ObjectId;
}

export const billPaymentModelFactory: ModelFactory<IPaymentDocument> = connection =>
    connection.model<IPaymentDocument>(ModelName.BILL_PAYMENT, BillPaymentSchema);
