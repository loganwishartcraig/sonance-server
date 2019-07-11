import { Document, Model, Types } from 'mongoose';
import { ModelName } from '../../constants/model_names';
import { IBillLineItem, IBillParticipant } from '../../models';
import { BillBodySchema } from '../../schemas';
import { ModelFactory } from '../types';

export interface IBillBody {
    readonly _id: Types.ObjectId;
    readonly createdBy: Types.ObjectId;
    readonly createdOn: Date;
    readonly deletedOn: Date | void;
    readonly tax: number;
    readonly tip: number;
    readonly lines: IBillLineItem[];
    readonly participants: IBillParticipant[];
}

export type INewBillBodyConfig = Omit<IBillBody, '_id' | 'createdOn'>;

export const billBodyModelFactory: ModelFactory<IBillBody> = connection =>
    connection.model<Document, Model<Document, IBillBody>>(ModelName.BILL_BODY, BillBodySchema);
