import { Document, Model, Types } from 'mongoose';
import { ModelName } from '../../constants/model_names';
import { UserSchema } from '../../schemas';
import { ModelFactory } from '../types';

export interface IUser {
    readonly _id: Types.ObjectId;
    readonly email: string;
    readonly displayName: string;
    readonly createdOn: Date;
    readonly avatar: string;
}

export type IUserConfig = Omit<IUser, '_id' | 'createdOn'>;

export const userModelFactory: ModelFactory<IUser> = connection =>
    connection.model<Document, Model<Document, IUser>>(ModelName.USER, UserSchema);
