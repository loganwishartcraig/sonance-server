import { Document, Types } from 'mongoose';

export interface IFriendGroupMember {
    readonly id: string;
    readonly user: string;
    readonly addedOn: Date;
}

export interface IFriendGroupMemberDocument extends Omit<IFriendGroupMember, 'id' | 'user'>, Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
}

export type IFriendGroupMemberConfig = Omit<IFriendGroupMember, 'id'>;
