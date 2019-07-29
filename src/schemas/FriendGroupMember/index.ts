import { ModelName } from '@constants/model_names';
import { IFriendGroupMemberDocument, IFriendGroupMember } from '@models';
import { Schema } from 'mongoose';

const friendGroupMemberSchema = new Schema<IFriendGroupMemberDocument>(
    {
        user: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true },
        addedOn: { type: Date, required: true, default: Date.now },
    },
    {
        toJSON: {
            transform: (doc: IFriendGroupMemberDocument): IFriendGroupMember => ({
                addedOn: doc.addedOn,
                id: doc._id.toHexString(),
                user: doc.user.toHexString(),
            }),
        },
    }
);

export default friendGroupMemberSchema;
