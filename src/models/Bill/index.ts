import { Connection, Document, Model, Schema } from 'mongoose';
import { IUser, USER_MODEL_NAME } from '../User';

export enum BillStatus {
    CANCELLED = -90,
    CREATED = 1,
    PARTIALLY_PAID,
    FULLY_PAID,
}

export interface IBill {
    readonly publicId: string;
    readonly createdOn: Date;
    readonly createdBy: IUser;
    readonly status: BillStatus;
}

export interface IBillSchema {
    readonly createdBy: { email: string };
}

export const billSchema = new Schema({
    publicId: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
    createdOn: { type: Number, required: true, default: () => new Date() },
    status: { type: Number, required: true, default: BillStatus.CREATED },
});

export const BILL_MODEL_NAME: string = 'Bill';

export const buildBillModel = (connection: Connection) =>
    connection.model<Document, Model<Document, IBill>>(BILL_MODEL_NAME, billSchema);
