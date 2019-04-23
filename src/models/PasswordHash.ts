import { Connection, Schema } from 'mongoose';

export interface IPasswordHash {
    readonly email: string;
    readonly hash: string;
}

export interface IPasswordHashSchema {
    readonly email: string;
    readonly hash: string;
}

export const passwordHashSchema = new Schema({
    email: { type: String, required: true },
    hash: { type: String, required: true },
});

export const buildPasswordHashModel = (connection: Connection) =>
    connection.model('PasswordHash', passwordHashSchema);
