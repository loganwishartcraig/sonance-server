import { Schema } from 'mongoose';
import { ModelName } from '../../constants/model_names';
import { IBillParticipant } from '../../models';

const billParticipantSchema = new Schema<IBillParticipant>({
    participant: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    joinedOn: { type: Date, required: true, default: Date.now },
    invitedBy: { type: Schema.Types.ObjectId, ref: ModelName.USER },
    invitedOn: { type: Date },
    leftOn: { type: Date },
});

export default billParticipantSchema;
