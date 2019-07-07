import { Schema } from 'mongoose';
import { IFriendship } from '../../models';
import { ModelName } from '../../constants/model_names';

const friendshipSchema = new Schema<IFriendship>({
    toUser: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    fromUser: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
});

export default friendshipSchema;
