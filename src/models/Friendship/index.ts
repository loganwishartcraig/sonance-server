import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { FriendshipSchema } from '@schemas';
import { Document, Model, Types } from 'mongoose';

export interface IFriendship {
    readonly _id: string;
    readonly to: Types.ObjectId;
    readonly from: Types.ObjectId;
    readonly createdOn: Date;
}

export type IFriendshipConfig = Omit<IFriendship, '_id'>;

export const friendshipModelFactory: ModelFactory<IFriendship> = connection =>
    connection.model<Document, Model<Document, IFriendship>>(ModelName.FRIENDSHIP, FriendshipSchema);
