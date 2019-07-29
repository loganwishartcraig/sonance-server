import { Document, Types } from 'mongoose';

export interface IParticipant {
    readonly id: string;
    readonly participant: string;
    readonly joinedOn: Date;
    readonly invitedBy: string | void;
    readonly invitedOn: Date | void;
    readonly leftOn: Date | void;
}

export type IParticipantConfig = Omit<IParticipant, 'id'>;

export interface IParticipantDocument extends Omit<IParticipant, 'id' | 'participant' | 'invitedBy'>, Document {
    _id: Types.ObjectId;
    participant: Types.ObjectId;
    invitedBy: Types.ObjectId | void;
}
