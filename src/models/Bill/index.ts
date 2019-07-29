import { ModelName } from '@constants/model_names';
import { ILineItem, ILineItemConfig, ILineItemDocument } from '@models/LineItem';
import { IParticipant, IParticipantConfig, IParticipantDocument } from '@models/Participant';
import { ModelFactory } from '@models/types';
import { IUser } from '@models/User';
import { BillBodySchema } from '@schemas';
import { Document, Types } from 'mongoose';

export interface IBill {
    readonly id: string;
    readonly createdBy: string;
    readonly createdOn: Date;
    readonly deletedOn?: Date | void;
    readonly tax: number;
    readonly tip: number;
    readonly shareCode: string;
    readonly lines: ILineItem[];
    readonly participants: IParticipant[];
}

export type IBillConfig = Omit<IBill, 'id' | 'createdOn' | 'lines' | 'participants'> & {
    lines: ILineItemConfig[];
    participants: IParticipantConfig[];
};

export type IBIllBodyUpdateConfig = Partial<Omit<IBill, 'id'>>;

export interface IBillDocument extends Omit<IBill, 'id' | 'createdBy' | 'lines' | 'participants'>, Document {
    _id: Types.ObjectId;
    createdBy: Types.ObjectId;
    lines: Types.DocumentArray<ILineItemDocument>;
    participants: Types.DocumentArray<IParticipantDocument>;
}

export const billBodyModelFactory: ModelFactory<IBillDocument> = connection =>
    connection.model<IBillDocument>(ModelName.BILL_BODY, BillBodySchema);

export class BillBody {
    public static createdByUser(bill: IBillDocument, user: IUser): boolean {
        return user && bill.createdBy.equals(user.id);
    }
    public static userIsParticipant(bill: IBillDocument, user: IUser): boolean {
        return user && !!bill.participants.filter(({ participant }) => participant.equals(user.id)).length;
    }
}
