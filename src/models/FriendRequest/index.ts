import { Connection, Document, Model } from 'mongoose';
import { FriendRequestSchema } from '../../schemas';
import { IUser } from '../User';
import { ModelName } from '../../constants/model_names';

export interface IFriendRequest {
    readonly _id: string;
    readonly fromUser: IUser;
    readonly toUser: IUser;
    readonly invitedOn: Date;
    readonly respondedOn: Date | void;
    readonly rejected: boolean | void;
}

export type INewFriendRequestConfig = Omit<IFriendRequest, '_id' | 'respondedOn' | 'rejected'>;

export const friendRequestModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IFriendRequest>>(ModelName.FRIEND_REQUEST, FriendRequestSchema);
