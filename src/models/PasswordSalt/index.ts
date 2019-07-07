import { Connection, Document, Model } from 'mongoose';
import { PasswordSaltSchema } from '../../schemas';

export interface IPasswordSalt {
    readonly _id: string;
    readonly email: string;
    readonly salt: string;
}

// All fields required
export type INewPasswordSaltConfig = Omit<IPasswordSalt, '_id'>;

export const PASSWORD_SALT_MODEL_NAME = 'PasswordSalt' as const;

export const passwordSaltModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IPasswordSalt>>(PASSWORD_SALT_MODEL_NAME, PasswordSaltSchema);
