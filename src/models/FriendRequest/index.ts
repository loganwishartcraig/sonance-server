import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { FriendRequestSchema } from '@schemas';
import { Document, Model, Types } from 'mongoose';

export interface IFriendRequest {
    readonly _id: Types.ObjectId;
    readonly fromUser: Types.ObjectId;
    readonly toUser: Types.ObjectId;
    readonly invitedOn: Date;
    readonly respondedOn: Date | void;
    readonly rejected: boolean | void;
}

export type IFriendRequestConfig = Omit<IFriendRequest, '_id' | 'respondedOn' | 'rejected'>;

export const friendRequestModelFactory: ModelFactory<IFriendRequest> = connection =>
    connection.model<Document, Model<Document, IFriendRequest>>(ModelName.FRIEND_REQUEST, FriendRequestSchema);
