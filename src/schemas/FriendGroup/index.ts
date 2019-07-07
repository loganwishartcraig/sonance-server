import { Schema } from 'mongoose';
import schemaValidators from '../../common/SchemaValidators';
import friendGroupMemberSchema from '../FriendGroupMember';
import { IFriendGroup } from '../../models';
import { ModelName } from '../../constants/model_names';

const friendGroupSchema = new Schema<IFriendGroup>({
    createdBy: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
    displayName: { type: String, required: true, validate: schemaValidators.isLength({ min: 1, max: 250 }), },
    avatar: { type: String },
    members: [friendGroupMemberSchema],
});

export default friendGroupSchema;
