import { Schema, SchemaTypes } from 'mongoose';

export interface IUserGroup {
    readonly _id: string;
    readonly name: string;
    readonly createdOn: Date;
    readonly createdBy: string;
    readonly participants: string[];
}

export type INewUserGroupConfig = Pick<IUserGroup, 'name' | 'createdBy' | 'participants'>;

export const userGroupSchema = new Schema({
    name: { type: String, required: true },
    createdOn: { type: Date, required: true, default: Date.now },
    createdBy: { type: SchemaTypes.ObjectId, required: true },
    participants: { type: SchemaTypes.DocumentArray, required: true },
});
