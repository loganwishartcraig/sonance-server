import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { PasswordSaltSchema } from '@schemas';
import { Document, Model } from 'mongoose';

export interface IPasswordSalt {
    readonly _id: string;
    readonly email: string;
    readonly salt: string;
}

// All fields required
export type IPasswordSaltConfig = Omit<IPasswordSalt, '_id'>;

export const passwordSaltModelFactory: ModelFactory<IPasswordSalt> = connection =>
    connection.model<Document, Model<Document, IPasswordSalt>>(ModelName.PASSWORD_SALT, PasswordSaltSchema);
