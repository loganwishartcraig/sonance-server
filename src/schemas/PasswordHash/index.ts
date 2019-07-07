import { Schema } from 'mongoose';
import { IPasswordHash } from '../../models/PasswordHash';

const passwordHashSchema = new Schema<IPasswordHash>({
    email: { type: String, required: true },
    hash: { type: String, required: true },
});

export default passwordHashSchema;
