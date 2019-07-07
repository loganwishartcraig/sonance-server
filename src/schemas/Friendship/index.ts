import { Schema } from 'mongoose';
import { IFriendship, USER_MODEL_NAME } from '../../models';

const friendshipSchema = new Schema<IFriendship>({
    toUser: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
    fromUser: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
});

export default friendshipSchema;
