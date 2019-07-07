import { Schema } from 'mongoose';
import SchemaValidators from '../../common/SchemaValidators';
import { IBillBody } from '../../models/BillBody';
import { MODEL_NAME } from '../../models/User';
import billLineItemSchema from '../BillLineItem';
import billParticipantSchema from '../BillParticipant';

const billBodySchema = new Schema<IBillBody>({
    createdBy: { type: Schema.Types.ObjectId, ref: MODEL_NAME, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
    deletedOn: { type: Date },
    tax: { type: Number, required: true, validate: SchemaValidators.gtez('Tax cannot be negative') },
    tip: { type: Number, required: true, validate: SchemaValidators.gtez('Tip cannot be negative.') },
    lines: [billLineItemSchema],
    participants: [billParticipantSchema],
});

export default billBodySchema;
