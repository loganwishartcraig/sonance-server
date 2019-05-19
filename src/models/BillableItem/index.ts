import { Schema, SchemaTypeOpts } from 'mongoose';

export enum PaymentStatus {
    CREATED = 1,
    PARTIALLY_PAID,
    FULLY_PAID,
}

export interface IBillableItem {
    readonly _id: string;
    readonly name: string;
    readonly amount: number;
    readonly statusLastChanged: Date;
    readonly status: PaymentStatus;
}

export type ICreateBillableItem = Pick<IBillableItem, 'name' | 'amount'>;

const validateAmount: [SchemaTypeOpts.ValidateFn<number>, string] = [
    value => value >= 0,
    'The amount for a billable item cannot be negative.',
];

export const billableItemSchema = new Schema<IBillableItem>({
    name: { type: String, required: true },
    amount: { type: Number, required: true, validate: validateAmount },
    statusLastChanged: { type: Date, required: true, default: new Date() },
    status: { type: Number, required: true, default: PaymentStatus.CREATED },
});
