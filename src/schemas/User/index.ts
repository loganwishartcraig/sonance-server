import schemaValidators from '@common/SchemaValidators';
import { IUserDocument } from '@models';
import { Schema } from 'mongoose';

const userSchema = new Schema<IUserDocument>({
    displayName: { type: String, validate: schemaValidators.isLength({ min: 1, max: 250 }) },
    email: { type: String, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
    avatar: { type: String },
});

export default userSchema;
