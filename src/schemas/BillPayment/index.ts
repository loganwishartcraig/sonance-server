import { Schema } from 'mongoose';
import schemaValidators from '../../common/SchemaValidators';
import { IBillPayment, USER_MODEL_NAME, BillPaymentMethod } from '../../models';

const billPaymentSchema = new Schema<IBillPayment>({
    paidBy: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
    paidTo: { type: Schema.Types.ObjectId, ref: USER_MODEL_NAME, required: true, index: true },
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
