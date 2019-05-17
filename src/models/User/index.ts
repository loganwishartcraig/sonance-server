import { Connection, Document, Model, Schema } from 'mongoose';

export interface IUser {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
}

export interface IUserSchema {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
}

export const TEST_USER: IUser = {
    id: '1',
    email: 'test_email@test.com',
    firstName: 'F_Test',
    lastName: 'L_Test',
};

export const userSchema = new Schema({
    firstName: { type: String, required: true, },
    lastName: { type: String, required: true, },
    email: { type: String, required: true, index: true },
});

export const USER_MODEL_NAME: string = 'User';

export const buildUserModel = (connection: Connection) =>
    connection.model<Document, Model<Document, IUser>>('User', userSchema);
