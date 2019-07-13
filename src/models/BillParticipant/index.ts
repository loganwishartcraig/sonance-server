import { Types } from 'mongoose';

export interface IBillParticipant {
    readonly _id: Types.ObjectId;
    readonly participant: Types.ObjectId;
    readonly joinedOn: Date;
    readonly invitedBy: Types.ObjectId | void;
    readonly invitedOn: Date | void;
    readonly leftOn: Date | void;
}

export type IBillParticipantConfig = Omit<IBillParticipant, '_id'>;
