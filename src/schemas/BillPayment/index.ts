import schemaValidators from '@common/SchemaValidators';
import { ModelName } from '@constants/model_names';
import { BillPaymentMethod, IBillPayment } from '@models';
import { Schema } from 'mongoose';

const billPaymentSchema = new Schema<IBillPayment>({
    paidBy: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
    paidTo: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
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
