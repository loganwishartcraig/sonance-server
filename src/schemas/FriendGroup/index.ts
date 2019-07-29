import schemaValidators from '@common/SchemaValidators';
import { ModelName } from '@constants/model_names';
import { IFriendGroupDocument, IFriendGroup } from '@models';
import friendGroupMemberSchema from '@schemas/FriendGroupMember';
import { Schema } from 'mongoose';

const friendGroupSchema = new Schema<IFriendGroupDocument>(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
        createdOn: { type: Date, required: true, default: Date.now },
        displayName: { type: String, required: true, validate: schemaValidators.isLength({ min: 1, max: 250 }), },
        avatar: { type: String },
        members: [friendGroupMemberSchema],
    },
    {
        toJSON: {
            transform: (doc: IFriendGroupDocument): IFriendGroup => ({
                avatar: doc.avatar,
                createdBy: doc.createdBy.toHexString(),
                createdOn: doc.createdOn,
                displayName: doc.displayName,
                id: doc._id.toHexString(),
                members: doc.members.map(member => member.toJSON()),
            }),
        },
    }
);

export default friendGroupSchema;
