import { Connection, Document, Model } from 'mongoose';
import { UserSchema } from '../../schemas';

export interface IUser {
    readonly _id: string;
    readonly email: string;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
}

export type INewUserConfig = Omit<IUser, '_id' | 'createdOn'>;

export const USER_MODEL_NAME = 'User' as const;

export const userModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IUser>>(USER_MODEL_NAME, UserSchema);
