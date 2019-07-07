import { Connection, Document, Model, model } from 'mongoose';
import { FriendshipSchema } from '../../schemas';
import { IUser } from '../User';

export interface IFriendship {
    readonly _id: string;
    readonly to: IUser;
    readonly from: IUser;
    readonly createdOn: Date;
}

export type INewFriendshipConfig = Omit<IFriendship, '_id'>;

export const MODEL_NAME = 'Friendship' as const;

const modelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IFriendship>>(MODEL_NAME, FriendshipSchema);

export default modelFactory;
