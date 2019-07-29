import { IPasswordSaltDocument, IPasswordSalt } from '@models';
import { Schema } from 'mongoose';

const passwordSaltSchema = new Schema<IPasswordSaltDocument>(
    {
        email: { type: String, required: true },
        salt: { type: String, required: true },
    },
    {
        toJSON: {
            transform: (doc: IPasswordSaltDocument): IPasswordSalt => ({
                email: doc.email,
                id: doc._id.toHexString(),
                salt: doc.salt,
            }),
        },
    }
);

export default passwordSaltSchema;
