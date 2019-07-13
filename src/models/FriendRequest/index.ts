import { Document, Model, Types } from 'mongoose';
import { ModelName } from '../../constants/model_names';
import { FriendRequestSchema } from '../../schemas';
import { ModelFactory } from '../types';
import { IUser } from '../User';

export interface IFriendRequest {
    readonly _id: Types.ObjectId;
    readonly fromUser: IUser;
    readonly toUser: IUser;
    readonly invitedOn: Date;
    readonly respondedOn: Date | void;
    readonly rejected: boolean | void;
}

export type IFriendRequestConfig = Omit<IFriendRequest, '_id' | 'respondedOn' | 'rejected'>;

export const friendRequestModelFactory: ModelFactory<IFriendRequest> = connection =>
    connection.model<Document, Model<Document, IFriendRequest>>(ModelName.FRIEND_REQUEST, FriendRequestSchema);
