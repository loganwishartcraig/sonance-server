import { Types } from 'mongoose';

export interface IFriendGroupMember {
    readonly _id: Types.ObjectId;
    readonly user: Types.ObjectId;
    readonly addedOn: Date;
}

export type IFriendGroupMemberConfig = Omit<IFriendGroupMember, '_id'>;
