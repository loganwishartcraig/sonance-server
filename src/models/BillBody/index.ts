import { Connection, Document, Model } from 'mongoose';
import { BillBodySchema } from '../../schemas';
import { IUser } from '../User';
import IBillLineItem from '../BillLineItem';
import IBillParticipant from '../BillParticipant';

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

export const MODEL_NAME = 'BillBody' as const;

const modelFactory = (connection: Connection) =>
    connection.model<Document, Model<Document, IBillBody>>(MODEL_NAME, BillBodySchema);

export default modelFactory;
