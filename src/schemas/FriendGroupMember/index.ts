import { Schema } from 'mongoose';
import IFriendGroupMember from '../../models/FriendGroupMember';
import { MODEL_NAME } from '../../models/User';

const friendGroupMemberSchema = new Schema<IFriendGroupMember>({
    user: { type: Schema.Types.ObjectId, ref: MODEL_NAME, required: true },
    addedOn: { type: Date, required: true, default: Date.now },
});

export default friendGroupMemberSchema;
