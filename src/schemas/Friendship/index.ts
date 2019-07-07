import { Schema } from 'mongoose';
import { IFriendship } from '../../models/Friendship';
import { MODEL_NAME } from '../../models/User';

const friendshipSchema = new Schema<IFriendship>({
    toUser: { type: Schema.Types.ObjectId, ref: MODEL_NAME, required: true, index: true },
    fromUser: { type: Schema.Types.ObjectId, ref: MODEL_NAME, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
});

export default friendshipSchema;
