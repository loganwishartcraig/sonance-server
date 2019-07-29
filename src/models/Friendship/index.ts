import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { FriendshipSchema } from '@schemas';
import { Document, Types } from 'mongoose';

export interface IFriendship {
    readonly id: string;
    readonly to: string;
    readonly from: string;
    readonly createdOn: Date;
}

export type IFriendshipConfig = Omit<IFriendship, 'id'>;

export interface IFriendshipDocument extends Omit<IFriendship, 'id' | 'to' | 'from'>, Document {
    _id: Types.ObjectId;
    to: Types.ObjectId;
    from: Types.ObjectId;
}

export const friendshipModelFactory: ModelFactory<IFriendshipDocument> = connection =>
    connection.model<IFriendshipDocument>(ModelName.FRIENDSHIP, FriendshipSchema);
