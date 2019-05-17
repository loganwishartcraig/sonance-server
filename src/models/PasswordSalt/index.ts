import { Connection, Schema } from 'mongoose';

export interface IPasswordSalt {
    readonly email: string;
    readonly salt: string;
}

export interface IPasswordSaltSchema {
    readonly email: string;
    readonly salt: string;
}

export const PASSWORD_SALT_MODEL_NAME: string = 'PasswordSalt';

export const passwordSaltSchema = new Schema({
    email: { type: String, required: true },
    salt: { type: String, required: true },
});

export const buildPasswordSaltModel = (connection: Connection) =>
    connection.model(PASSWORD_SALT_MODEL_NAME, passwordSaltSchema);
