import { Schema } from 'mongoose';
import { IBillParticipant, USER_MODEL_NAME } from '../../models';

const billParticipantSchema = new Schema<IBillParticipant>({
    participant: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
    joinedOn: { type: Date, required: true, default: Date.now },
    invitedBy: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME },
    invitedOn: { type: Date },
    leftOn: { type: Date },
});

export default billParticipantSchema;
