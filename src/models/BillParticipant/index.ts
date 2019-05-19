import { Schema, SchemaTypes } from 'mongoose';

export interface IBillParticipant {
    readonly _id: string;
    readonly createdOn: Date;
    readonly memberId: string;
}

export type ICreateBillParticipantConfig = Pick<IBillParticipant, 'memberId'>;

export const billParticipantSchema = new Schema<IBillParticipant>({
    createdOn: { type: Date, required: true, default: new Date() },
    memberId: { type: SchemaTypes.ObjectId, required: true },
});
