import { IBill, IBillDocument, ILineItemConfig, ILineItemDocument, IParticipant, IParticipantDocument, ILineItem } from '@models';

export type Optional<T extends {}, Keys extends keyof T> = {
    [key in Keys]?: T[key];
};

export interface IResponseLocals {

    bill?: IBillDocument;
    bills?: IBillDocument[];
    billUpdates?: Partial<IBill>[];

    line?: ILineItemDocument;
    lines?: ILineItemDocument[];
    lineUpdates?: Partial<ILineItem>[];

    participant?: IParticipantDocument;
    participants?: IParticipantDocument[];
    participantUpdates?: Partial<IParticipant>[];

}

export type ILoadedResponseLocals = Required<IResponseLocals>;
