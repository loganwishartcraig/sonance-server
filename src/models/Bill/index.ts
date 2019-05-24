import { Connection, Document, Model, Schema, SchemaTypeOpts } from 'mongoose';
import { USER_MODEL_NAME } from '../User';
import { Optional } from '../../common/types';
import { billableItemSchema } from '../BillableItem';
import { billParticipantSchema } from '../BillParticipant';

export enum BillStatus {
    CANCELLED = -90,
    CREATED = 1,
    PARTIALLY_PAID,
    FULLY_PAID,
}

export interface IBill {
    readonly publicId: string;
    readonly createdBy: string;
    readonly createdOn: string;
    readonly status: BillStatus;
    readonly statusLastChanged: Date;
    readonly name: string;
    readonly totalAmount: number;
}

export type INewBillConfig = Pick<IBill, 'createdBy' | 'totalAmount'> & Optional<IBill, 'name'>;

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
        transform: (_doc, ret) => { delete ret._id; },
        publicId: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
        createdOn: { type: Date, required: true, default: () => new Date() },
        status: { type: Number, required: true, default: BillStatus.CREATED, validate: validateBillStatus },
        statusLastChanged: { type: Number, required: true, default: new Date() },
        name: { type: String },
        totalAmount: { type: Number, required: true, validate: validateTotalAmount },
        items: [billableItemSchema],
        participants: [billParticipantSchema],
    },
    {
        toObject: {
            transform: (_doc, ret) => { delete ret._id; },
        },
        toJSON: {
            transform: (_doc, ret) => { delete ret._id; },
        },
    }
);

export const buildBillModel = (connection: Connection) =>
    connection.model<Document, Model<Document, IBill>>(BILL_MODEL_NAME, billSchema);
