import { ModelName } from '@constants/model_names';
import { IFriendGroupMember } from '@models/FriendGroupMember';
import { ModelFactory } from '@models/types';
import { FriendGroupSchema } from '@schemas';
import { Document, Model, Types } from 'mongoose';

export interface IFriendGroup {
    readonly _id: Types.ObjectId;
    readonly createdBy: Types.ObjectId;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
    readonly members: IFriendGroupMember[];
}

export type IFriendGroupConfig = Omit<IFriendGroup, '_id'>;

export const friendGroupModelFactory: ModelFactory<IFriendGroup> = connection =>
    connection.model<Document, Model<Document, IFriendGroup>>(ModelName.FRIEND_GROUP, FriendGroupSchema);
