import { Connection, Document, Model } from 'mongoose';
import { FriendGroupSchema } from '../../schemas';
import { IUser } from '../User';
import IFriendGroupMember from '../FriendGroupMember';

export interface IFriendGroup {
    readonly _id: string;
    readonly createdBy: IUser;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
    readonly members: IFriendGroupMember[];
}

export type INewFriendGroupConfig = Omit<IFriendGroup, '_id'>;

export const MODEL_NAME = 'FriendGroup' as const;

const modelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IFriendGroup>>(MODEL_NAME, FriendGroupSchema);

export default modelFactory;
