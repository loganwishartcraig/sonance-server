import { Connection, Document, Model } from 'mongoose';
import { FriendGroupSchema } from '../../schemas';
import { IUser } from '../User';
import { IFriendGroupMember } from '../';
import { ModelName } from '../../constants/model_names';

export interface IFriendGroup {
    readonly _id: string;
    readonly createdBy: IUser;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
    readonly members: IFriendGroupMember[];
}

export type INewFriendGroupConfig = Omit<IFriendGroup, '_id'>;

export const friendGroupModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IFriendGroup>>(ModelName.FRIEND_GROUP, FriendGroupSchema);
