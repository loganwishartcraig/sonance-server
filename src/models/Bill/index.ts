import { Connection, Document, Model, Schema, SchemaTypeOpts } from 'mongoose';
import { Optional } from '../../common/types';
import { billableItemSchema, IBillableItem, ICreateBillableItem } from '../BillableItem';
import { billParticipantSchema, IBillParticipant, ICreateBillParticipant } from '../BillParticipant';
import { USER_MODEL_NAME } from '../User';

export enum BillStatus {
    CANCELLED = -90,
    CREATED = 1,
    PARTIALLY_PAID,
    FULLY_PAID,
}

export interface IBill {
    readonly createdBy: string;
    readonly createdOn: string;
    readonly status: BillStatus;
    readonly statusLastChanged: Date;
    readonly name: string;
    readonly totalAmount: number;
    readonly items: IBillableItem[];
    readonly participants: IBillParticipant[];
}

export type INewBillConfig = Pick<IBill, 'createdBy' | 'totalAmount'>
    & Optional<IBill, 'name'>
    & {
        items?: ICreateBillableItem[];
        participants?: ICreateBillParticipant[];
    };

export const BILL_MODEL_NAME: string = 'Bill';

const validateTotalAmount: [SchemaTypeOpts.ValidateFn<number>, string] = [
    value => value >= 0,
    'The total amount for a bill cannot be negative.',
];

const validateBillStatus: [SchemaTypeOpts.ValidateFn<BillStatus>, string] = [
    status => typeof BillStatus[status] === 'string',
    'An invalid bill status cannot be applied.',
];

export const billSchema = new Schema<IBill>(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
        createdOn: { type: Date, required: true, default: Date.now },
        status: { type: Number, required: true, default: BillStatus.CREATED, validate: validateBillStatus },
        statusLastChanged: { type: Number, required: true, default: Date.now },
        name: { type: String },
        totalAmount: { type: Number, required: true, validate: validateTotalAmount },
        items: [billableItemSchema],
        participants: [billParticipantSchema],
    }
);

export const buildBillModel = (connection: Connection) =>
    connection.model<Document, Model<Document, IBill>>(BILL_MODEL_NAME, billSchema);
