import { ModelName } from '@constants/model_names';
import { IFriendRequestDocument, IFriendRequest } from '@models';
import { Schema } from 'mongoose';

const friendRequestSchema = new Schema<IFriendRequestDocument>(
    {
        toUser: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
        fromUser: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
        invitedOn: { type: Date, required: true, default: Date.now },
        respondedOn: { type: Date },
        rejected: { type: Boolean },
    },
    {
        toJSON: {
            transform: (doc: IFriendRequestDocument): IFriendRequest => ({
                fromUser: doc.fromUser.toHexString(),
                id: doc._id.toHexString(),
                invitedOn: doc.invitedOn,
                rejected: doc.rejected,
                respondedOn: doc.respondedOn,
                toUser: doc.toUser.toHexString(),
            }),
        },
    });

export default friendRequestSchema;
