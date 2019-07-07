import { Schema } from 'mongoose';
import schemaValidators from '../../common/SchemaValidators';
import { IFriendGroup } from '../../models/FriendGroup';
import { MODEL_NAME } from '../../models/User';
import friendGroupMemberSchema from '../FriendGroupMember';

const friendGroupSchema = new Schema<IFriendGroup>({
    createdBy: { type: Schema.Types.ObjectId, ref: MODEL_NAME, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
    displayName: { type: String, required: true, validate: schemaValidators.isLength({ min: 1, max: 250 }), },
    avatar: { type: String },
    members: [friendGroupMemberSchema],
});

export default friendGroupSchema;
