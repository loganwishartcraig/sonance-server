import { Document, Model, Types } from 'mongoose';
import { IFriendGroupMember } from '../';
import { ModelName } from '../../constants/model_names';
import { FriendGroupSchema } from '../../schemas';
import { ModelFactory } from '../types';
import { IUser } from '../User';

export interface IFriendGroup {
    readonly _id: Types.ObjectId;
    readonly createdBy: IUser;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
    readonly members: IFriendGroupMember[];
}

export type IFriendGroupConfig = Omit<IFriendGroup, '_id'>;

export const friendGroupModelFactory: ModelFactory<IFriendGroup> = connection =>
    connection.model<Document, Model<Document, IFriendGroup>>(ModelName.FRIEND_GROUP, FriendGroupSchema);
