import { Connection, Document, Model } from 'mongoose';

export type ModelFactory<T = any> = (connection: Connection) => Model<Document, T>;

export { IBillBody, IBillBodyConfig } from './BillBody';
export { IBillLineItem, IBillLineItemConfig } from './BillLineItem';
export { IBillParticipant, IBillParticipantConfig } from './BillParticipant';
export { IBillPayment, IBillPaymentConfig } from './BillPayment';
export { IFriendGroup, IFriendGroupConfig } from './FriendGroup';
export { IFriendGroupMember, IFriendGroupMemberConfig } from './FriendGroupMember';
export { IFriendRequest, IFriendRequestConfig } from './FriendRequest';
export { IFriendship, IFriendshipConfig } from './Friendship';
export { IPasswordHash, IPasswordHashConfig } from './PasswordHash';
export { IPasswordSalt, IPasswordSaltConfig } from './PasswordSalt';
export { IUser, IUserConfig } from './User';
