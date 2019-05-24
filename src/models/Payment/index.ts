import { Schema, SchemaTypeOpts, SchemaType, SchemaTypes, Model, Connection, Document } from 'mongoose';
import { Omit } from '../../common/types';

export interface IPayment {
    readonly _id: string;
    readonly publicId: string;
    readonly createdOn: Date;
    readonly amount: number;
    readonly sender: string;
    readonly recipient: string;
}

export type INewPaymentConfig = Omit<IPayment, '_id'>;

export const PAYMENT_MODEL_NAME: string = 'Payment';

const validateAmount: [SchemaTypeOpts.ValidateFn<number>, string] = [
    value => value > 0,
    'The amount for a payment must be greater than zero.',
];

export const paymentSchema = new Schema<IPayment>({
    publicId: { type: String, required: true },
    createdOn: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true, validate: validateAmount },
    sender: { type: SchemaTypes.ObjectId, required: true },
    recipient: { type: SchemaTypes.ObjectId, required: true },
});

export const buildPaymentModel = (connection: Connection) =>
    connection.model<Document, Model<Document, IPayment>>(PAYMENT_MODEL_NAME, paymentSchema);
