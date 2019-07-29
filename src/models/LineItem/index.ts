import { Document, Types } from 'mongoose';

export interface ILineItem {
    readonly id: string;
    readonly createdBy: string;
    readonly createdOn: Date;
    claimedBy: string | void;
    claimedOn: Date | void;
    deletedOn: Date | void;
    isShared: boolean;
    quantity: number;
    price: number;
}

export type ILineItemConfig = Omit<ILineItem, 'id' | 'createdOn'>;

export type ILineItemUpdate = Partial<Omit<ILineItem, 'id'>>;

export interface ILineItemDocument extends Omit<ILineItem, 'id' | 'createdBy' | 'claimedBy'>, Document {
    _id: Types.ObjectId;
    createdBy: Types.ObjectId;
    claimedBy: Types.ObjectId | void;
}
