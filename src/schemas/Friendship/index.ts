import { ModelName } from '@constants/model_names';
import { IFriendship } from '@models';
import { Schema } from 'mongoose';

const friendshipSchema = new Schema<IFriendship>({
    toUser: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    fromUser: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
});

export default friendshipSchema;
