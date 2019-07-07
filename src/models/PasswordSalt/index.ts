import { Connection, Document, Model } from 'mongoose';
import { PasswordSaltSchema } from '../../schemas';
import { ModelName } from '../../constants/model_names';

export interface IPasswordSalt {
    readonly _id: string;
    readonly email: string;
    readonly salt: string;
}

// All fields required
export type INewPasswordSaltConfig = Omit<IPasswordSalt, '_id'>;

export const passwordSaltModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IPasswordSalt>>(ModelName.PASSWORD_SALT, PasswordSaltSchema);
