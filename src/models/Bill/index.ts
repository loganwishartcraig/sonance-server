import { Connection, Document, Model, Schema, Mongoose, SchemaTypeOpts } from 'mongoose';
import { IUser, USER_MODEL_NAME } from '../User';

export enum BillStatus {
    CANCELLED = -90,
    CREATED = 1,
    PARTIALLY_PAID,
    FULLY_PAID,
}

export interface IBill {
    readonly publicId: string;
    readonly name: string;
    readonly createdOn: Date;
    readonly createdBy: IUser;
    readonly status: BillStatus;
    readonly statusLastChanged: Date;
    readonly totalAmount: Number;
}

export interface IBillSchema {
    publicId: string;
    createdBy: string;
    createdOn: string;
    status: BillStatus;
    statusLastChanged: string;
    name: string;
    totalAmount: number;
}

export interface INewBillConfig {
    createdBy: string;
    totalAmount: number;
    name?: string;
}

export const BILL_MODEL_NAME: string = 'Bill';

const validateTotalAmount: [SchemaTypeOpts.ValidateFn<number>, string] = [
    value => value > 0,
    'The total amount for a bill cannot be negative.',
];

const validateBillStatus: [SchemaTypeOpts.ValidateFn<BillStatus>, string] = [
    status => typeof BillStatus[status] === 'string',
    'An invalid bill status cannot be applied.',
];

export const billSchema = new Schema<IBillSchema>({
    publicId: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
    createdOn: { type: Date, required: true, default: () => new Date() },
    status: { type: Number, required: true, default: BillStatus.CREATED, validate: validateBillStatus },
    statusLastChanged: { type: Number, required: true, default: new Date() },
    name: { type: String },
    totalAmount: { type: Number, required: true, validate: validateTotalAmount },
});

export const buildBillModel = (connection: Connection) =>
    connection.model<Document, Model<Document, IBill>>(BILL_MODEL_NAME, billSchema);
