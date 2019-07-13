import { Schema } from 'mongoose';
import { IFriendGroupMember } from '@models';
import { ModelName } from '@constants/model_names';

const friendGroupMemberSchema = new Schema<IFriendGroupMember>({
    user: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true },
    addedOn: { type: Date, required: true, default: Date.now },
});

export default friendGroupMemberSchema;
