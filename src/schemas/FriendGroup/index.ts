import { Schema } from 'mongoose';
import schemaValidators from '../../common/SchemaValidators';
import friendGroupMemberSchema from '../FriendGroupMember';
import { IFriendGroup, USER_MODEL_NAME } from '../../models';

console.warn('******TEST, fg', { USER_MODEL_NAME })
const friendGroupSchema = new Schema<IFriendGroup>({
    createdBy: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
    displayName: { type: String, required: true, validate: schemaValidators.isLength({ min: 1, max: 250 }), },
    avatar: { type: String },
    members: [friendGroupMemberSchema],
});

export default friendGroupSchema;
