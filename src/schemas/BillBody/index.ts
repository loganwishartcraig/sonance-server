import schemaValidators from '@common/SchemaValidators';
import { ModelName } from '@constants/model_names';
import { IBillBody } from '@models';
import billLineItemSchema from '@schemas/BillLineItem';
import billParticipantSchema from '@schemas/BillParticipant';
import { Schema } from 'mongoose';

const billBodySchema = new Schema<IBillBody>({
    createdBy: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
    deletedOn: { type: Date },
    tax: { type: Number, required: true, validate: schemaValidators.gtez('Tax cannot be negative') },
    tip: { type: Number, required: true, validate: schemaValidators.gtez('Tip cannot be negative.') },
    shareCode: { type: String, required: true },
    lines: [billLineItemSchema],
    participants: [billParticipantSchema],
});

export default billBodySchema;
