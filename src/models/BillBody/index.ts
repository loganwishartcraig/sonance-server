import { Document, Model } from 'mongoose';
import { ModelName } from '../../constants/model_names';
import { IBillLineItem, IBillParticipant } from '../../models';
import { BillBodySchema } from '../../schemas';
import { ModelFactory } from '../types';
import { IUser } from '../User';

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

export const billBodyModelFactory: ModelFactory<IBillBody> = connection =>
    connection.model<Document, Model<Document, IBillBody>>(ModelName.BILL_BODY, BillBodySchema);
