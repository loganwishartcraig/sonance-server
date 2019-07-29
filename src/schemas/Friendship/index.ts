import { ModelName } from '@constants/model_names';
import { IFriendshipDocument, IFriendship } from '@models';
import { Schema } from 'mongoose';

const friendshipSchema = new Schema<IFriendshipDocument>(
    {
        toUser: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
        fromUser: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
        createdOn: { type: Date, required: true, default: Date.now },
    },
    {
        toJSON: {
            transform: (doc: IFriendshipDocument): IFriendship => ({
                createdOn: doc.createdOn,
                from: doc.from.toHexString(),
                to: doc.to.toHexString(),
                id: doc._id.toHexString(),
            }),
        },
    }
);

export default friendshipSchema;
