import { Connection, Schema } from 'mongoose';

export interface IPasswordSalt {
    readonly email: string;
    readonly salt: string;
}

export interface IPasswordSaltSchema {
    readonly email: string;
    readonly salt: string;
}

export const passwordSaltSchema = new Schema({
    email: { type: String, required: true },
    salt: { type: String, required: true },
});

export const buildPasswordSaltModel = (connection: Connection) =>
    connection.model('PasswordSalt', passwordSaltSchema);
