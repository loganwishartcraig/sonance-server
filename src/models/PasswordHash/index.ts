import { Connection, Document, Model } from 'mongoose';
import { PasswordHashSchema } from '../../schemas';
import { ModelName } from '../../constants/model_names';

export interface IPasswordHash {
    readonly _id: string;
    readonly email: string;
    readonly hash: string;
}

// All fields required for creation
export type INewPasswordHashConfig = Omit<IPasswordHash, '_id'>;

export const passwordHashModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IPasswordHash>>(ModelName.PASSWORD_HASH, PasswordHashSchema);
