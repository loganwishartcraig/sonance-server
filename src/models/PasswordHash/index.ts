import { Connection, Schema } from 'mongoose';
import { Omit } from '../../common/types';

export interface IPasswordHash {
    readonly _id: string;
    readonly email: string;
    readonly hash: string;
}

// All fields required for creation
export type INewPasswordHashConfig = Omit<IPasswordHash, '_id'>;

export const PASSWORD_HASH_MODEL_NAME: string = 'PasswordHash';

export const passwordHashSchema = new Schema<IPasswordHash>({
    email: { type: String, required: true },
    hash: { type: String, required: true },
});

export const buildPasswordHashModel = (connection: Connection) =>
    connection.model(PASSWORD_HASH_MODEL_NAME, passwordHashSchema);
