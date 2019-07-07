import { Connection, Document, Model } from 'mongoose';
import { FriendRequestSchema } from '../../schemas';
import { IUser } from '../User';

export interface IFriendRequest {
    readonly _id: string;
    readonly fromUser: IUser;
    readonly toUser: IUser;
    readonly invitedOn: Date;
    readonly respondedOn: Date | void;
    readonly rejected: boolean | void;
}

export type INewFriendRequestConfig = Omit<IFriendRequest, '_id' | 'respondedOn' | 'rejected'>;

export const MODEL_NAME = 'FriendRequest' as const;

const modelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IFriendRequest>>(MODEL_NAME, FriendRequestSchema);

export default modelFactory;
