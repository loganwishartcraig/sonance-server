import { Connection, Document, Model, QueryFindOneAndUpdateOptions } from 'mongoose';

export interface IDatabaseServiceConfig {
    readonly connection: Connection;
    readonly modelFactory: ModelFactory;
}

export type ModelFactory = (conn: Connection) => Model<Document>;

// Separation of IRestrictedDatabaseService/IDatabaseService
// was done with the intention of allowing a service to eventually
// implement a more limited set of APIs for querying data.
// Mainly to be used with authentication/password tables.
export interface IRestrictedDatabaseService<ModelType = any> {
    findOne: (query: any) => Promise<ModelType | void>;
    insert: (payload: any) => Promise<ModelType>;
    upsert: (query: any, payload: any) => Promise<ModelType>;
    removeOne: (query: any) => Promise<void>;
}

export interface IDatabaseService<ModelType = any> {
    find: (query: any) => Promise<ModelType[]>;
    exists: (query: any) => Promise<boolean>;
    findOne: (query: any) => Promise<ModelType | void>;
    insert: (payload: any) => Promise<ModelType>;
    upsert: (query: any, payload: any) => Promise<ModelType>;
    removeOne: (query: any) => Promise<void>;
}

export type SchemaValueMap<ModelSchema> = {
    [key in keyof ModelSchema]?: any;
};

export type TypeSafeSchemaValueMap<ModelSchema> = {
    [key in keyof ModelSchema]?: ModelSchema[key];
};

// DatabaseService implements both IDatabaseService/IRestrictedDatabaseService
// for convenience. This allows password services to extend this class but
// still just leverage the IRestrictedDatabaseService interface.
export class DatabaseService<ModelType = any, ModelSchema = {}> implements
    IDatabaseService<ModelType>,
    IRestrictedDatabaseService<ModelType>
{

    protected readonly _connection: Connection;
    protected readonly _ready: Promise<boolean>;
    protected readonly _modelFactory: ModelFactory;
    protected _model: Model<Document>;

    constructor(config: IDatabaseServiceConfig) {
        this._connection = config.connection;
        this._modelFactory = config.modelFactory;
        this._ready = this._initModel();
        this._connection.on('error', this._handleConnectionError);
    }

    public async find<QueryShape extends TypeSafeSchemaValueMap<ModelSchema>>(query: QueryShape): Promise<ModelType[]> {

        await this._ready;

        const results = await this._model.find(query).exec();

        return results.map(result => result.toObject());

    }

    public async findOne<QueryShape extends {}>(query: QueryShape): Promise<ModelType | undefined> {

        await this._ready;

        const result = await this._model.findOne(query).exec();

        if (result) {
            return result.toObject();
        }

    }

    public async insert<PayloadShape extends {}>(payload: PayloadShape): Promise<ModelType> {

        await this._ready;

        const insertionPayload = this._formatForInsert(payload);
        const record = await this._model.create(insertionPayload);

        return record.toObject();

    }

    public async upsert<QueryShape extends Object, PayloadShape extends Object>(
        query: QueryShape, payload: PayloadShape
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

    public async removeOne<QueryShape extends Object>(query: QueryShape): Promise<void> {
        await this._ready;
        await this._model.findOneAndRemove().exec();
    }

    public async exists<QueryShape extends Object>(query: QueryShape): Promise<boolean> {

        await this._ready;

        const records = await this.find(query);

        return !!records.length;

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
