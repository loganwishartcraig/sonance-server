import { Types } from 'mongoose';

export interface IBillLineItem {
    readonly _id: Types.ObjectId;
    readonly createdBy: Types.ObjectId;
    readonly createdOn: Date;
    readonly claimedBy: Types.ObjectId | void;
    readonly deletedOn: Date | void;
    readonly isShared: boolean;
    readonly quantity: number;
    readonly price: number;
}

export type IBillLineItemConfig = Omit<IBillLineItem, '_id' | 'createdOn'>;
