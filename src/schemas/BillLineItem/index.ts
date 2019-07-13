import { Schema } from 'mongoose';
import schemaValidators from '../../common/SchemaValidators';
import { ModelName } from '../../constants/model_names';
import { IBillLineItem } from '../../models';

const billLineItemSchema = new Schema<IBillLineItem>({
    createdBy: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    createdOn: { type: Date, required: true, default: Date.now },
    claimedBy: { type: Schema.Types.ObjectId, ref: ModelName.USER },
    deletedOn: { type: Date },
    isShared: { type: Boolean, required: true, default: false },
    quantity: {
        type: Number,
        required: true,
        validate: schemaValidators.gtz('A line items quantity must be greater than zero.'),
    },
    price: {
        type: Number,
        required: true,
        validate: schemaValidators.gtez('The price of a line item cannot be negative.'),
    },
});

export default billLineItemSchema;
