import { Document, Model, Types } from 'mongoose';
import { IBillLineItem, IBillLineItemConfig } from '@models/BillLineItem';
import { IBillParticipant, IBillParticipantConfig } from '@models/BillParticipant';
import { ModelFactory } from '@models/types';
import { ModelName } from '@constants/model_names';
import { BillBodySchema } from '@schemas';
import { IUser } from '@models/User';

export interface IBillBody {
    readonly _id: Types.ObjectId;
    readonly createdBy: Types.ObjectId;
    readonly createdOn: Date;
    readonly deletedOn?: Date | void;
    readonly tax: number;
    readonly tip: number;
    readonly shareCode: string;
    readonly lines: IBillLineItem[];
    readonly participants: IBillParticipant[];
}

export type IBillBodyConfig = Omit<IBillBody, '_id' | 'createdOn' | 'lines' | 'participants'> & {
    lines: IBillLineItemConfig[];
    participants: IBillParticipantConfig[];
};

export type IBIllBodyUpdateConfig = Partial<Omit<IBillBody, '_id'>>;

export const billBodyModelFactory: ModelFactory<IBillBody> = connection =>
    connection.model<Document, Model<Document, IBillBody>>(ModelName.BILL_BODY, BillBodySchema);

export class BillBody {
    public static createdByUser(bill: IBillBody, user: IUser): boolean {
        return user && bill.createdBy.equals(user._id);
    }
}
