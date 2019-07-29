import schemaValidators from '@common/SchemaValidators';
import { ModelName } from '@constants/model_names';
import { ILineItemDocument, ILineItem } from '@models';
import { Schema } from 'mongoose';

const lineItemSchema = new Schema<ILineItemDocument>(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
        createdOn: { type: Date, required: true, default: Date.now },
        claimedBy: { type: Schema.Types.ObjectId, ref: ModelName.USER },
        claimedOn: { type: Date },
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
    },
    {
        toJSON: {
            transform: (doc: ILineItemDocument): ILineItem => ({
                claimedBy: (doc.claimedBy) ? doc.claimedBy.toHexString() : undefined,
                claimedOn: doc.claimedOn,
                createdBy: doc.createdBy.toHexString(),
                createdOn: doc.createdOn,
                deletedOn: doc.deletedOn,
                id: doc._id.toHexString(),
                isShared: doc.isShared,
                price: doc.price,
                quantity: doc.quantity,
            }),
        },
    }
);

export default lineItemSchema;
