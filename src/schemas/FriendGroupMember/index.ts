import { Schema } from 'mongoose';
import { IFriendGroupMember, USER_MODEL_NAME } from '../../models';

const friendGroupMemberSchema = new Schema<IFriendGroupMember>({
    user: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true },
    addedOn: { type: Date, required: true, default: Date.now },
});

export default friendGroupMemberSchema;
