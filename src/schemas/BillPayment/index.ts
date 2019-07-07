import { Schema } from 'mongoose';
import schemaValidators from '../../common/SchemaValidators';
import { BillPaymentMethod, IBillPayment } from '../../models/BillPayment';
import { MODEL_NAME } from '../../models/User';

const billPaymentSchema = new Schema<IBillPayment>({
    paidBy: { type: Schema.Types.ObjectId, ref: MODEL_NAME, required: true, index: true },
    paidTo: { type: Schema.Types.ObjectId, ref: MODEL_NAME, required: true, index: true },
    paidOn: { type: Date, required: true },
    amount: { type: Number, required: true, validate: schemaValidators.gtez('You cannot pay a negative amount') },
    method: {
        type: String,
        required: true,
        validate: schemaValidators.inEnum(
            BillPaymentMethod,
            'The provided payment method is invalid.'
        ),
    },
});

export default billPaymentSchema;
