import { Schema } from 'mongoose';
import { IFriendRequest } from '../../models';
import { ModelName } from '../../constants/model_names';

const friendRequestSchema = new Schema<IFriendRequest>({
    toUser: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    fromUser: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    invitedOn: { type: Date, required: true, default: Date.now },
    respondedOn: { type: Date },
    rejected: { type: Boolean },
});

export default friendRequestSchema;
