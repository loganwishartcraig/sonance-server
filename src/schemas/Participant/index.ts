import { ModelName } from '@constants/model_names';
import { IParticipantDocument, IParticipant } from '@models';
import { Schema } from 'mongoose';

const participantSchema = new Schema<IParticipantDocument>(
    {
        participant: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
        joinedOn: { type: Date, required: true, default: Date.now },
        invitedBy: { type: Schema.Types.ObjectId, ref: ModelName.USER },
        invitedOn: { type: Date },
        leftOn: { type: Date },
    },
    {
        toJSON: {
            transform: (doc: IParticipantDocument): IParticipant => ({
                id: doc._id.toHexString(),
                invitedBy: (doc.invitedBy) ? doc.invitedBy.toHexString() : undefined,
                invitedOn: doc.invitedOn,
                joinedOn: doc.joinedOn,
                leftOn: doc.leftOn,
                participant: doc.participant.toHexString(),
            }),
        },
    }
);

export default participantSchema;
