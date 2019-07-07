import { Connection, Document, Model } from 'mongoose';
import { FriendGroupSchema } from '../../schemas';
import { IUser } from '../User';
import { IFriendGroupMember } from '../';

export interface IFriendGroup {
    readonly _id: string;
    readonly createdBy: IUser;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
    readonly members: IFriendGroupMember[];
}

export type INewFriendGroupConfig = Omit<IFriendGroup, '_id'>;

export const FRIEND_GROUP_MODEL_NAME = 'FriendGroup' as const;

export const friendGroupModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IFriendGroup>>(FRIEND_GROUP_MODEL_NAME, FriendGroupSchema);
