import { Schema } from 'mongoose';
import { IFriendRequest, USER_MODEL_NAME } from '../../models';

const friendRequestSchema = new Schema<IFriendRequest>({
    toUser: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
    fromUser: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
    invitedOn: { type: Date, required: true, default: Date.now },
    respondedOn: { type: Date },
    rejected: { type: Boolean },
});

export default friendRequestSchema;
