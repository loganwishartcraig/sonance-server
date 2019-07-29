import { IBill, ILineItemConfig, IParticipant } from '@models';
import { Document } from 'mongoose';

export type Optional<T extends {}, Keys extends keyof T> = {
    [key in Keys]?: T[key];
};

export interface IResponseLocals {

    bill?: Document;
    bills?: IBill[];
    billUpdates?: Partial<IBill>[];

    line?: ILineItemConfig;
    lines?: ILineItemConfig[];
    lineUpdates?: Partial<ILineItemConfig>[];

    participant?: IParticipant;
    participants?: IParticipant[];
    participantUpdates?: Partial<IParticipant>[];

}
