import { Connection, Schema } from 'mongoose';
import { Omit } from '../../common/types';

export interface IPasswordSalt {
    readonly _id: string;
    readonly email: string;
    readonly salt: string;
}

// All fields required
export type INewPasswordSaltConfig = Omit<IPasswordSalt, '_id'>;

export const PASSWORD_SALT_MODEL_NAME: string = 'PasswordSalt';

export const passwordSaltSchema = new Schema<IPasswordSalt>({
    email: { type: String, required: true },
    salt: { type: String, required: true },
});

export const buildPasswordSaltModel = (connection: Connection) =>
    connection.model(PASSWORD_SALT_MODEL_NAME, passwordSaltSchema);
