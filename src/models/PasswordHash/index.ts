import { ModelName } from '@constants/model_names';
import { ModelFactory } from '@models/types';
import { PasswordHashSchema } from '@schemas';
import { Document, Types } from 'mongoose';

export interface IPasswordHash {
    readonly id: string;
    readonly email: string;
    readonly hash: string;
}

// All fields required for creation
export type IPasswordHashConfig = Omit<IPasswordHash, 'id'>;

export interface IPasswordHashDocument extends Omit<IPasswordHash, 'id'>, Document {
    _id: Types.ObjectId;
}

export const passwordHashModelFactory: ModelFactory<IPasswordHashDocument> = connection =>
    connection.model<IPasswordHashDocument>(ModelName.PASSWORD_HASH, PasswordHashSchema);
