import { Connection, Model, Document } from 'mongoose';

export type ModelFactory<T extends Document = Document> = (connection: Connection) => Model<T>;
