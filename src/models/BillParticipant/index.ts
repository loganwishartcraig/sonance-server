import { Schema, SchemaTypes } from 'mongoose';

export interface IBillParticipant {
    readonly _id: string;
    readonly createdOn: Date;
    readonly memberId: string;
}

export type ICreateBillParticipant = Pick<IBillParticipant, 'memberId'>;

export const billParticipantSchema = new Schema<IBillParticipant>({
    createdOn: { type: Date, required: true, default: Date.now },
    memberId: { type: SchemaTypes.ObjectId, required: true },
});
