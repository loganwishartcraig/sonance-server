import { Connection, Document, Model, Schema } from 'mongoose';

export interface IUser {
    readonly id: string;
    readonly email: string;
    readonly name: {
        readonly first: string;
        readonly last: string;
    };
}

export interface IUserSchema {
    readonly name: {
        readonly first: string;
        readonly last: string;
    };
    readonly email: string;
}

export const TEST_USER: IUser = {
    id: '1',
    email: 'test_email@test.com',
    name: {
        first: 'F_Test',
        last: 'L_Test',
    },
};

export const userSchema = new Schema({
    name: {
        first: { type: String, required: true, },
        last: { type: String, required: true, },
    },
    email: { type: String, required: true },
});

export const buildUserModel = (connection: Connection) =>
    connection.model<Document, Model<Document, IUser>>('User', userSchema);
