import { Connection, Document, Model } from 'mongoose';
import { PasswordSaltSchema } from '../../schemas';

export interface IPasswordSalt {
    readonly _id: string;
    readonly email: string;
    readonly salt: string;
}

// All fields required
export type INewPasswordSaltConfig = Omit<IPasswordSalt, '_id'>;

export const MODEL_NAME = 'PasswordSalt' as const;

const modelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IPasswordSalt>>(MODEL_NAME, PasswordSaltSchema);

export default modelFactory;
