import { Schema } from 'mongoose';
import { IFriendRequest } from '../../models/FriendRequest';
import { MODEL_NAME } from '../../models/User';

const friendRequestSchema = new Schema<IFriendRequest>({
    toUser: { type: Schema.Types.ObjectId, ref: MODEL_NAME, required: true, index: true },
    fromUser: { type: Schema.Types.ObjectId, ref: MODEL_NAME, required: true, index: true },
    invitedOn: { type: Date, required: true, default: Date.now },
    respondedOn: { type: Date },
    rejected: { type: Boolean },
});

export default friendRequestSchema;
