import { Schema } from 'mongoose';
import { IPasswordSalt } from '../../models/PasswordSalt';

const passwordSaltSchema = new Schema<IPasswordSalt>({
    email: { type: String, required: true },
    salt: { type: String, required: true },
});

export default passwordSaltSchema;
