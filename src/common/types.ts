import { IBillBody, IBillLineItem, IBillParticipant } from '@models';
import { Document } from 'mongoose';

export type Optional<T extends {}, Keys extends keyof T> = {
    [key in Keys]?: T[key];
};

export interface IResponseLocals {

    bill?: Document;
    bills?: IBillBody[];
    billUpdates?: Partial<IBillBody>[];

    line?: IBillLineItem;
    lines?: IBillLineItem[];
    lineUpdates?: Partial<IBillLineItem>[];

    participant?: IBillParticipant;
    participants?: IBillParticipant[];
    participantUpdates?: Partial<IBillParticipant>[];

}
