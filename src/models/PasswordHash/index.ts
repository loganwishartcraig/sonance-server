import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { PasswordHashSchema } from '@schemas';
import { Document } from 'mongoose';

export interface IPasswordHash {
    readonly id: string;
    readonly email: string;
    readonly hash: string;
}

// All fields required for creation
export type IPasswordHashConfig = Omit<IPasswordHash, '_id'>;

export interface IPasswordHashDocument extends Omit<IPasswordHash, 'id'>, Document {
    // left open for extension
}

export const passwordHashModelFactory: ModelFactory<IPasswordHashDocument> = connection =>
    connection.model<IPasswordHashDocument>(ModelName.PASSWORD_HASH, PasswordHashSchema);
