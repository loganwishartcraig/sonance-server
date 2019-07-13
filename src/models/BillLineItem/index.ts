import { IUser } from '../User';
import { Types } from 'mongoose';

export interface IBillLineItem {
    readonly _id: Types.ObjectId;
    readonly createdBy: IUser;
    readonly createdOn: Date;
    readonly claimedBy: IUser | void;
    readonly deletedOn: Date | void;
    readonly isShared: boolean;
    readonly quantity: number;
    readonly price: number;
}

export type INewBillLineItem = Omit<IBillLineItem, '_id' | 'createdOn'>;
