import { Connection, Document, Model, Schema } from 'mongoose';
import { Omit } from '../../common/types';

export interface IUser {
    readonly _id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
}

export type INewUserConfig = Omit<IUser, '_id'>;

export const USER_MODEL_NAME: string = 'User';

export const TEST_USER: IUser = {
    _id: '1',
    email: 'test_email@test.com',
    firstName: 'F_Test',
    lastName: 'L_Test',
};

export const userSchema = new Schema({
    firstName: { type: String, required: true, },
    lastName: { type: String, required: true, },
    email: { type: String, required: true, index: true },
});

export const buildUserModel = (connection: Connection) =>
    connection.model<Document, Model<Document, IUser>>('User', userSchema);
