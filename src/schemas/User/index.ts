import { Schema } from 'mongoose';
import schemaValidators from '../../common/SchemaValidators';
import { IUser } from '../../models';

const userSchema = new Schema<IUser>({
    displayName: { type: String, validate: schemaValidators.isLength({ min: 1, max: 250 }) },
    email: { type: String, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
    avatar: { type: String },
});

export default userSchema;
