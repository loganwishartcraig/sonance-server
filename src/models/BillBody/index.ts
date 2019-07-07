import { Connection, Document, Model } from 'mongoose';
import { BillBodySchema } from '../../schemas';
import { IUser } from '../User';
import { IBillParticipant, IBillLineItem } from '../../models';
import { ModelName } from '../../constants/model_names';

export interface IBillBody {
    readonly _id: string;
    readonly createdBy: IUser;
    readonly createdOn: Date;
    readonly deletedOn: Date | void;
    readonly tax: number;
    readonly tip: number;
    readonly lines: IBillLineItem[];
    readonly participants: IBillParticipant[];
}

export type INewBillBodyConfig = Omit<IBillBody, '_id'>;

export const billBodyModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IBillBody>>(ModelName.BILL_BODY, BillBodySchema);
