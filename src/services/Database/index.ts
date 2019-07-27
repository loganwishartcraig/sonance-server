import { Connection, Document, Model, QueryFindOneAndUpdateOptions } from 'mongoose';
import { ModelFactory } from '@models/types';
import { ErrorFactoryBase } from '@common/ErrorFactory';

export interface IDatabaseServiceConfig<T = any> {
    readonly connection: Connection;
    readonly modelFactory: ModelFactory<T>;
    readonly errorFactory: ErrorFactoryBase;
}

// Separation of IRestrictedDatabaseService/IDatabaseService
// was done with the intention of allowing a service to eventually
// implement a more limited set of APIs for querying data.
// Mainly to be used with authentication/password tables.
export interface IRestrictedDatabaseService<
    ModelType extends {} = any,
    CreationInterface extends {} = any
    > {
    findOne: (query: SchemaValueMap<ModelType>) => Promise<ModelType | void>;
    insert: (payload: CreationInterface) => Promise<ModelType>;
    upsert: (query: SchemaValueMap<ModelType>, payload: CreationInterface) => Promise<ModelType>;
    removeOne: (query: SchemaValueMap<ModelType>) => Promise<void>;
}

export interface IDatabaseService<
    ModelType extends {} = any,
    CreationInterface extends {} = any
    > extends IRestrictedDatabaseService<ModelType, CreationInterface> {

    find: (query: SchemaValueMap<ModelType>) => Promise<ModelType[]>;
    exists: (query: SchemaValueMap<ModelType>) => Promise<boolean>;
    updateOne: (query: SchemaValueMap<ModelType>, updates: Partial<ModelType>) => Promise<ModelType | void>;
    update: (query: SchemaValueMap<ModelType>, updates: Partial<ModelType>) => Promise<ModelType[]>;

    loadOneRaw: (query: any) => Promise<Document | null>;
    save: (doc: Document) => Promise<void>;

}

export type SchemaValueMap<ModelSchema> = {
    [key in keyof ModelSchema]?: any;
};

// DatabaseService implements both IDatabaseService/IRestrictedDatabaseService
// for convenience. This allows password services to extend this class but
// still just leverage the IRestrictedDatabaseService interface.
export class DatabaseService<ModelType, CreationInterface> implements
    IDatabaseService<ModelType, CreationInterface>,
    IRestrictedDatabaseService<ModelType, CreationInterface>
{

    protected readonly _connection: Connection;
    protected readonly _ready: Promise<boolean>;
    protected readonly _modelFactory: ModelFactory;
    protected readonly _errorFactory: ErrorFactoryBase;
    protected _model: Model<Document>;

    constructor(config: IDatabaseServiceConfig) {
        this._connection = config.connection;
        this._modelFactory = config.modelFactory;
        this._ready = this._initModel();
        this._errorFactory = config.errorFactory;
        this._connection.on('error', this._handleConnectionError);
    }

    public async find(query: SchemaValueMap<ModelType>): Promise<ModelType[]> {

        await this._ready;

        const results = await this._model.find(query).exec();

        return results.map(result => result.toObject());

    }

    public async findOne(query: SchemaValueMap<ModelType>): Promise<ModelType | void> {

        await this._ready;

        const result = await this._model.findOne(query).exec();

        if (result) {
            return result.toObject();
        }

    }

    public async insert<PayloadShape extends {}>(
        payload: PayloadShape
    ): Promise<ModelType> {

        await this._ready;

        const insertionPayload = this._formatForInsert(payload);
        const record = await this._model.create(insertionPayload);

        return record.toObject();

    }

    public async upsert<PayloadShape extends Object>(
        query: SchemaValueMap<ModelType>,
        payload: PayloadShape
    ): Promise<ModelType> {

        await this._ready;

        const insertionPayload = this._formatForInsert(payload);

        const options: QueryFindOneAndUpdateOptions = {
            upsert: true,
            setDefaultsOnInsert: true,
            new: true,
        };

        const record = await this._model.findOneAndUpdate(query, insertionPayload, options).exec();

        return (record as Document).toObject();

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

    public async loadOneRaw(query: any): Promise<Document | null> {

        await this._ready;

        return this._model.findOne(query).exec();

    }

    public async save(doc: Document): Promise<void> {
        await doc.save();
    }

    public async update(query: SchemaValueMap<ModelType>, updates: Partial<ModelType>): Promise<ModelType[]> {

        await this._ready;

        await this._model.updateMany(query, updates).exec();

        return await this.find(query);

    }

    public async updateOne(
        query: SchemaValueMap<ModelType>,
        updates: Partial<ModelType>
    ): Promise<ModelType | void> {

        await this._ready;

        const updated = await this._model.findOneAndUpdate(query, updates).exec();

        if (updated) {
            updated.toObject();
        }

    }

    protected _formatForInsert(payload: any): any {
        return payload;
    }

    private async _initModel(): Promise<boolean> {

        await this._databaseConnected();

        this._model = this._modelFactory(this._connection);

        return true;

    }

    private async _databaseConnected(): Promise<void> {

        new Promise((res, rej) => {

            // ready state is 1 on 'connected'.
            if (this._connection.readyState === 1) {
                res();
            } else {
                this._connection.once('connected', () => res());
            }

        });

    }

    private _handleConnectionError(...args: any[]) {
        console.error('Database error occurred', args);
    }

}
