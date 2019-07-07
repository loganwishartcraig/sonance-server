import { Connection, Document, Model } from 'mongoose';
import { FriendshipSchema } from '../../schemas';
import { IUser } from '../User';
import { ModelName } from '../../constants/model_names';

export interface IFriendship {
    readonly _id: string;
    readonly to: IUser;
    readonly from: IUser;
    readonly createdOn: Date;
}

export type INewFriendshipConfig = Omit<IFriendship, '_id'>;

export const friendshipModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IFriendship>>(ModelName.FRIENDSHIP, FriendshipSchema);
