import { Document, Model } from 'mongoose';
import { IFriendGroupMember } from '../';
import { ModelName } from '../../constants/model_names';
import { FriendGroupSchema } from '../../schemas';
import { ModelFactory } from '../types';
import { IUser } from '../User';

export interface IFriendGroup {
    readonly _id: string;
    readonly createdBy: IUser;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
    readonly members: IFriendGroupMember[];
}

export type INewFriendGroupConfig = Omit<IFriendGroup, '_id'>;

export const friendGroupModelFactory: ModelFactory<IFriendGroup> = connection =>
    connection.model<Document, Model<Document, IFriendGroup>>(ModelName.FRIEND_GROUP, FriendGroupSchema);
