import { Types } from 'mongoose';

export interface IBillLineItem {
    readonly _id: Types.ObjectId;
    readonly createdBy: Types.ObjectId;
    readonly createdOn: Date;
    claimedBy: Types.ObjectId | void;
    claimedOn: Date | void;
    deletedOn: Date | void;
    isShared: boolean;
    quantity: number;
    price: number;
}

export type IBillLineItemConfig = Omit<IBillLineItem, '_id' | 'createdOn'>;

export type IBIllLineItemUpdateConfig = Partial<Omit<IBillLineItem, '_id'>>;
