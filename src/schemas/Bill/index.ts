import schemaValidators from '@common/SchemaValidators';
import { ModelName } from '@constants/model_names';
import { IBillDocument, IBill } from '@models';
import lineItemSchema from '@schemas/LineItem';
import participantSchema from '@schemas/Participant';
import { Schema } from 'mongoose';

// TODO: Remove default shareCode value here
const billSchema = new Schema<IBillDocument>(
    {
        createdBy: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
        createdOn: { type: Date, required: true, default: Date.now },
        deletedOn: { type: Date },
        tax: { type: Number, required: true, validate: schemaValidators.gtez('Tax cannot be negative') },
        tip: { type: Number, required: true, validate: schemaValidators.gtez('Tip cannot be negative.') },
        shareCode: { type: String, required: true, default: 'XXXXXX' },
        lines: [lineItemSchema],
        participants: [participantSchema],
    },
    {
        toJSON: {
            transform: (doc: IBillDocument): IBill => ({
                createdBy: doc.createdBy.toHexString(),
                createdOn: doc.createdOn,
                deletedOn: doc.deletedOn,
                id: doc._id.toHexString(),
                lines: doc.lines.map(line => line.toJSON()),
                participants: doc.participants.map(participant => participant.toJSON()),
                shareCode: doc.shareCode,
                tax: doc.tax,
                tip: doc.tip,
            }),
        },
    }
);

export default billSchema;
