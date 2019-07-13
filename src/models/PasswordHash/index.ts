import { Document, Model } from 'mongoose';
import { ModelName } from '../../constants/model_names';
import { PasswordHashSchema } from '../../schemas';
import { ModelFactory } from '../types';

export interface IPasswordHash {
    readonly _id: string;
    readonly email: string;
    readonly hash: string;
}

// All fields required for creation
export type IPasswordHashConfig = Omit<IPasswordHash, '_id'>;

export const passwordHashModelFactory: ModelFactory<IPasswordHash> = connection =>
    connection.model<Document, Model<Document, IPasswordHash>>(ModelName.PASSWORD_HASH, PasswordHashSchema);
