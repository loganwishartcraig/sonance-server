import { IPasswordHashDocument, IPasswordHash } from '@models';
import { Schema } from 'mongoose';

const passwordHashSchema = new Schema<IPasswordHashDocument>(
    {
        email: { type: String, required: true },
        hash: { type: String, required: true },
    },
    {
        toJSON: {
            transform: (doc: IPasswordHashDocument): IPasswordHash => ({
                email: doc.email,
                hash: doc.hash,
                id: doc._id.toHexString(),
            }),
        },
    }
);

export default passwordHashSchema;
