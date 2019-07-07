import { Connection, Document, Model } from 'mongoose';

export type ModelFactory<T = any> = (connection: Connection) => Model<Document, T>;
