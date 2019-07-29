import schemaValidators from '@common/SchemaValidators';
import { ModelName } from '@constants/model_names';
import { IPaymentDocument, PaymentMethod, IPayment } from '@models';
import { Schema } from 'mongoose';

const paymentSchema = new Schema<IPaymentDocument>(
    {
        paidBy: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
        paidTo: { type: Schema.Types.ObjectId, ref: ModelName.USER, required: true, index: true },
        paidOn: { type: Date, required: true },
        amount: { type: Number, required: true, validate: schemaValidators.gtez('You cannot pay a negative amount') },
        method: {
            type: String,
            required: true,
            validate: schemaValidators.inEnum(
                PaymentMethod,
                'The provided payment method is invalid.'
            ),
        },
    },
    {
        toJSON: {
            transform: (doc: IPaymentDocument): IPayment => ({
                amount: doc.amount,
                id: doc._id.toHexString(),
                method: doc.method,
                paidBy: doc.paidBy.toHexString(),
                paidTo: doc.paidTo.toHexString(),
                paidOn: doc.paidOn,
            }),
        },
    }
);

export default paymentSchema;
