import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { UserSchema } from '@schemas';
import { Connection, Document } from 'mongoose';

export interface IUser {
    readonly id: string;
    readonly email: string;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
}

export type IUserConfig = Omit<IUser, 'id' | 'createdOn'>;

export interface IUserDocument extends Omit<IUser, 'id'>, Document {
    // Left to extend with virtuals if needed
}

export const userModelFactory: ModelFactory<IUserDocument> = (connection: Connection) =>
    connection.model<IUserDocument>(ModelName.USER, UserSchema);
