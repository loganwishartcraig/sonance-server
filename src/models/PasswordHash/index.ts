import { Connection, Schema } from 'mongoose';

export interface IPasswordHash {
    readonly email: string;
    readonly hash: string;
}

export interface IPasswordHashSchema {
    readonly email: string;
    readonly hash: string;
}

export const PASSWORD_HASH_MODEL_NAME: string = 'PasswordHash';

export const passwordHashSchema = new Schema({
    email: { type: String, required: true },
    hash: { type: String, required: true },
});

export const buildPasswordHashModel = (connection: Connection) =>
    connection.model(PASSWORD_HASH_MODEL_NAME, passwordHashSchema);
