import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { PasswordSaltSchema } from '@schemas';
import { Document, Model, Types } from 'mongoose';

export interface IPasswordSalt {
    readonly id: string;
    readonly email: string;
    readonly salt: string;
}

// All fields required
export type IPasswordSaltConfig = Omit<IPasswordSalt, 'id'>;

export interface IPasswordSaltDocument extends Omit<IPasswordSalt, 'id'>, Document {
    _id: Types.ObjectId;
}

export const passwordSaltModelFactory: ModelFactory<IPasswordSaltDocument> = connection =>
    connection.model<IPasswordSaltDocument>(ModelName.PASSWORD_SALT, PasswordSaltSchema);
