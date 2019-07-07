import { Connection, Document, Model } from 'mongoose';
import { BillBodySchema } from '../../schemas';
import { IUser } from '../User';
import { IBillParticipant, IBillLineItem } from '../../models';

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

export const BILL_BODY_MODEL_NAME = 'BillBody' as const;

export const billBodyModelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IBillBody>>(BILL_BODY_MODEL_NAME, BillBodySchema);
