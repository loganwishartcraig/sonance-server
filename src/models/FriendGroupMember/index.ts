import { IUser } from '../User';

export interface IFriendGroupMember {
    readonly user: IUser;
    readonly addedOn: Date;
}
