import { Connection, Document, Model } from 'mongoose';
import { UserSchema } from '../../schemas';
import { ModelName } from '../../constants/model_names';

export interface IUser {
    readonly _id: string;
    readonly email: string;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
}

export type INewUserConfig = Omit<IUser, '_id' | 'createdOn'>;

export const userModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IUser>>(ModelName.USER, UserSchema);
