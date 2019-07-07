import { IUser } from '../User';

export default interface IBillLineItem {
    readonly createdBy: IUser;
    readonly createdOn: Date;
    readonly claimedBy: IUser | void;
    readonly deletedOn: Date | void;
    readonly isShared: boolean;
    readonly quantity: number;
    readonly price: number;
}
