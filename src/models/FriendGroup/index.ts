import { ModelName } from '@constants/model_names';
import { IFriendGroupMember, IFriendGroupMemberDocument } from '@models/FriendGroupMember';
import { ModelFactory } from '@models/types';
import { FriendGroupSchema } from '@schemas';
import { Document, Types } from 'mongoose';

export interface IFriendGroup {
    readonly id: string;
    readonly createdBy: string;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
    readonly members: IFriendGroupMember[];
}

export type IFriendGroupConfig = Omit<IFriendGroup, 'id'>;

export interface IFriendGroupDocument extends Omit<IFriendGroup, 'id' | 'createdBy' | 'members'>, Document {
    _id: Types.ObjectId;
    createdBy: Types.ObjectId;
    members: IFriendGroupMemberDocument[];
}

export const friendGroupModelFactory: ModelFactory<IFriendGroupDocument> = connection =>
    connection.model<IFriendGroupDocument>(ModelName.FRIEND_GROUP, FriendGroupSchema);
