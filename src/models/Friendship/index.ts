import { Document, Model } from 'mongoose';
import { ModelName } from '../../constants/model_names';
import { FriendshipSchema } from '../../schemas';
import { ModelFactory } from '../types';
import { IUser } from '../User';

export interface IFriendship {
    readonly _id: string;
    readonly to: IUser;
    readonly from: IUser;
    readonly createdOn: Date;
}

export type INewFriendshipConfig = Omit<IFriendship, '_id'>;

export const friendshipModelFactory: ModelFactory<IFriendship> = connection =>
    connection.model<Document, Model<Document, IFriendship>>(ModelName.FRIENDSHIP, FriendshipSchema);
