import { Document, Model, Types } from 'mongoose';
import { ModelName } from '../../constants/model_names';
import { IBillLineItem, IBillParticipant } from '../../models';
import { BillBodySchema } from '../../schemas';
import { ModelFactory } from '../types';
import { IUser } from '../User';
import { IBillLineItemConfig } from '../BillLineItem';
import { IBillParticipantConfig } from '../BillParticipant';

export interface IBillBody {
    readonly _id: Types.ObjectId;
    readonly createdBy: Types.ObjectId;
    readonly createdOn: Date;
    readonly deletedOn?: Date | void;
    readonly tax: number;
    readonly tip: number;
    readonly lines: IBillLineItem[];
    readonly participants: IBillParticipant[];
}

export type IBillBodyConfig = Omit<IBillBody, '_id' | 'createdOn' | 'lines' | 'participants'> & {
    lines: IBillLineItemConfig[];
    participants: IBillParticipantConfig[];
};

export const billBodyModelFactory: ModelFactory<IBillBody> = connection =>
    connection.model<Document, Model<Document, IBillBody>>(ModelName.BILL_BODY, BillBodySchema);

export class BillBody {
    public static CreatedByUser(bill: IBillBody, user: IUser): boolean {
        return user && bill.createdBy.equals(user._id);
    }
}
