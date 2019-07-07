import { IUser } from '../User';

export default interface IFriendGroupMember {
    readonly user: IUser;
    readonly addedOn: Date;
}
