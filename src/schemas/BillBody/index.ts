import { Schema } from 'mongoose';
import SchemaValidators from '../../common/SchemaValidators';
import billLineItemSchema from '../BillLineItem';
import billParticipantSchema from '../BillParticipant';
import { IBillBody, USER_MODEL_NAME } from '../../models';

console.warn('******TEST, bb', { USER_MODEL_NAME });

const billBodySchema = new Schema<IBillBody>({
    createdBy: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
    deletedOn: { type: Date },
    tax: { type: Number, required: true, validate: SchemaValidators.gtez('Tax cannot be negative') },
    tip: { type: Number, required: true, validate: SchemaValidators.gtez('Tip cannot be negative.') },
    lines: [billLineItemSchema],
    participants: [billParticipantSchema],
});

export default billBodySchema;
