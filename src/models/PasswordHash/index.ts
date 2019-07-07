import { Connection, Document, Model } from 'mongoose';
import { PasswordHashSchema } from '../../schemas';

export interface IPasswordHash {
    readonly _id: string;
    readonly email: string;
    readonly hash: string;
}

// All fields required for creation
export type INewPasswordHashConfig = Omit<IPasswordHash, '_id'>;

export const MODEL_NAME = 'PasswordHash' as const;

const modelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IPasswordHash>>(MODEL_NAME, PasswordHashSchema);

export default modelFactory;
