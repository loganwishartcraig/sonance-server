import { Schema, SchemaTypeOpts, SchemaType, SchemaTypes } from 'mongoose';
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

const validateAmount: [SchemaTypeOpts.ValidateFn<number>, string] = [
    value => value > 0,
    'The amount for a payment must be greater than zero.',
];

// TODO Update all 'default: new Date()' references to 'default: new Date'
export const paymentSchema = new Schema<IPayment>({
    publicId: { type: String, required: true },
    createdOn: { type: Date, required: true, default: new Date() },
    amount: { type: Number, required: true, validate: validateAmount },
    sender: { type: SchemaTypes.ObjectId, required: true },
    recipient: { type: SchemaTypes.ObjectId, required: true },
});
