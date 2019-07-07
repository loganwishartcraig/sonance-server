import { Document, Model } from 'mongoose';
import { ModelName } from '../../constants/model_names';
import { PasswordSaltSchema } from '../../schemas';
import { ModelFactory } from '../types';

export interface IPasswordSalt {
    readonly _id: string;
    readonly email: string;
    readonly salt: string;
}

// All fields required
export type INewPasswordSaltConfig = Omit<IPasswordSalt, '_id'>;

export const passwordSaltModelFactory: ModelFactory<IPasswordSalt> = connection =>
    connection.model<Document, Model<Document, IPasswordSalt>>(ModelName.PASSWORD_SALT, PasswordSaltSchema);
