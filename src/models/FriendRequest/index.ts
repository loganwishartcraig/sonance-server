import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { FriendRequestSchema } from '@schemas';
import { Document, Types } from 'mongoose';

export interface IFriendRequest {
    readonly id: string;
    readonly fromUser: string;
    readonly toUser: string;
    readonly invitedOn: Date;
    readonly respondedOn: Date | void;
    readonly rejected: boolean | void;
}

export type IFriendRequestConfig = Omit<IFriendRequest, 'id' | 'respondedOn' | 'rejected'>;

export interface IFriendRequestDocument extends Omit<IFriendRequest, 'id' | 'fromUser' | 'toUser'>, Document {
    _id: Types.ObjectId;
    fromUser: Types.ObjectId;
    toUser: Types.ObjectId;
}

export const friendRequestModelFactory: ModelFactory<IFriendRequestDocument> = connection =>
    connection.model<IFriendRequestDocument>(ModelName.FRIEND_REQUEST, FriendRequestSchema);
