import { Connection, Document, Model, QueryFindOneAndUpdateOptions } from 'mongoose';
import { ModelFactory } from '@models/types';
import { ErrorFactoryBase } from '@common/ErrorFactory';
import { GenericError } from '@common/GenericError';
import { ErrorCode } from '@constants/error_codes';

export interface IDatabaseServiceConfig<T extends Document> {
    readonly connection: Connection;
    readonly modelFactory: ModelFactory<T>;
    readonly errorFactory: ErrorFactoryBase;
}

export interface IDatabaseService<
    DocumentType extends Document = Document,
    ModelType extends {} = any
    > {

    findOne: (query: SchemaValueMap<ModelType>) => Promise<DocumentType | null>;
    insert: (payload: Partial<ModelType>) => Promise<DocumentType>;
    upsert: (query: SchemaValueMap<ModelType>, payload: any) => Promise<DocumentType>;
    removeOne: (query: SchemaValueMap<ModelType>) => Promise<void>;

    find: (query: SchemaValueMap<ModelType>) => Promise<DocumentType[]>;
    exists: (query: SchemaValueMap<ModelType>) => Promise<boolean>;
    updateOne: (query: SchemaValueMap<ModelType>, updates: any) => Promise<DocumentType | null>;
    update: (query: SchemaValueMap<ModelType>, updates: any) => Promise<DocumentType[]>;
    save: (doc: DocumentType) => Promise<DocumentType>;

}

export type SchemaValueMap<ModelType> = {
    [key in keyof ModelType]?: any;
} & {
    _id?: any;
};

export class DatabaseService<DocumentType extends Document, ModelType> implements
    IDatabaseService<DocumentType, ModelType>
{

    protected readonly _connection: Connection;
    protected readonly _ready: Promise<boolean>;
    protected readonly _modelFactory: ModelFactory<DocumentType>;
    protected readonly _errorFactory: ErrorFactoryBase;
    protected _model: Model<DocumentType>;

    private readonly _connectionTimeoutMs: number = 10000;

    constructor(config: IDatabaseServiceConfig<DocumentType>) {
        this._connection = config.connection;
        this._modelFactory = config.modelFactory;
        this._ready = this._initModel();
        this._errorFactory = config.errorFactory;
        this._connection.on('error', this._handleConnectionError);
    }

    public async find(query: SchemaValueMap<ModelType>): Promise<DocumentType[]> {

        await this._ready;

        return this._model.find(query).exec();

    }

    public async findOne(query: SchemaValueMap<ModelType>): Promise<DocumentType | null> {

        await this._ready;

        return this._model.findOne(query).exec();

    }

    public async insert(payload: Partial<ModelType>): Promise<DocumentType> {

        await this._ready;

        return this._model.create(payload);

    }

    public async upsert(query: SchemaValueMap<ModelType>, payload: Partial<ModelType>): Promise<DocumentType> {

        await this._ready;

        const options: QueryFindOneAndUpdateOptions = {
            upsert: true,
            setDefaultsOnInsert: true,
            new: true,
        };

        return this._model.findOneAndUpdate(query, payload, options).exec() as Promise<DocumentType>;

    }

    public async removeOne(query: SchemaValueMap<ModelType>): Promise<void> {
        await this._ready;
        await this._model.findOneAndRemove(query).exec();
    }

    public async exists(query: SchemaValueMap<ModelType>): Promise<boolean> {

        await this._ready;

        const records = await this.find(query);

        return !!records.length;

    }

    public async save(doc: DocumentType): Promise<DocumentType> {
        return doc.save();
    }

    public async update(query: SchemaValueMap<ModelType>, updates: Partial<DocumentType>): Promise<DocumentType[]> {

        await this._ready;

        await this._model.updateMany(query, updates).exec();

        return await this.find(query);

    }

    public async updateOne(
        query: SchemaValueMap<ModelType>,
        updates: any
    ): Promise<DocumentType | null> {

        await this._ready;

        return this._model.findOneAndUpdate(query, updates).exec();

    }

    private async _initModel(): Promise<boolean> {

        await this._databaseConnected();

        this._model = this._modelFactory(this._connection);

        return true;

    }

    private async _databaseConnected(): Promise<void> {

        new Promise((res, rej) => {

            const timeout = setTimeout(
                () => rej(this._buildTimeoutError()),
                this._connectionTimeoutMs
            );

            const resolve = () => {
                clearTimeout(timeout);
                res();
            };

            // ready state is 1 on 'connected'.
            if (this._connection.readyState === 1) {
                resolve();
            } else {
                this._connection.once('connected', () => resolve());
            }

        });

    }

    private _handleConnectionError(...args: any[]) {
        console.error('Database error occurred', args);
    }

    private _buildTimeoutError(): GenericError {
        return this._errorFactory.build(ErrorCode.CONNECTION_TIMEOUT, {
            message: 'The database failed to connect before the set timeout',
        });
    }

}
