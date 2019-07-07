import { Schema } from 'mongoose';
import IBillParticipant from '../../models/BillParticipant';
import { MODEL_NAME } from '../../models/User';

const billParticipantSchema = new Schema<IBillParticipant>({
    participant: { type: Schema.Types.ObjectId, ref: MODEL_NAME, required: true, index: true },
    joinedOn: { type: Date, required: true, default: Date.now },
    invitedBy: { type: Schema.Types.ObjectId, ref: MODEL_NAME },
    invitedOn: { type: Date },
    leftOn: { type: Date },
});

export default billParticipantSchema;
