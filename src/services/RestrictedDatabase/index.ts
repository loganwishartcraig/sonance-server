import { SchemaValueMap, IDatabaseServiceConfig } from '@services/Database';
import { Document, Connection, Model, QueryFindOneAndUpdateOptions } from 'mongoose';
import { ModelFactory } from '@models/types';
import { ErrorFactoryBase } from '@common/ErrorFactory';
import { GenericError } from '@common/GenericError';
import { ErrorCode } from '@constants/error_codes';

// Separation of IRestrictedDatabaseService/IDatabaseService
// was done with the intention of allowing a service to
// implement a more limited set of APIs for querying data.
// Mainly to be used with authentication/password tables.
export interface IRestrictedDatabaseService<
    ModelType extends {} = any
    > {
    findOne: (query: SchemaValueMap<ModelType>) => Promise<ModelType | null>;
    insert: (payload: Partial<ModelType>) => Promise<ModelType>;
    upsert: (query: SchemaValueMap<ModelType>, payload: Partial<ModelType>) => Promise<ModelType>;
    removeOne: (query: SchemaValueMap<ModelType>) => Promise<void>;
}

// Deliberately mirrors much of the DatabaseService functionality, without
// extending. Done to remove any coupling between the two, as this class
// could change details depending on security practices.
export class RestrictedDatabaseService<DocumentType extends Document, ModelType> implements
    IRestrictedDatabaseService<ModelType>
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

    public async findOne(query: SchemaValueMap<ModelType>): Promise<ModelType | null> {

        await this._ready;

        const result = await this._model.findOne(query).exec();

        return (result) ? result.toJSON() : null;

    }

    public async insert(payload: Partial<ModelType>): Promise<ModelType> {

        await this._ready;

        const record = await this._model.create(payload);

        return record.toJSON();

    }

    public async upsert(query: SchemaValueMap<ModelType>, payload: Partial<ModelType>): Promise<ModelType> {

        await this._ready;

        const options: QueryFindOneAndUpdateOptions = {
            upsert: true,
            setDefaultsOnInsert: true,
            new: true,
        };

        const record = await this._model.findOneAndUpdate(query, payload, options).exec() as DocumentType;

        return record.toJSON();

    }

    public async removeOne(query: SchemaValueMap<ModelType>): Promise<void> {
        await this._ready;
        await this._model.findOneAndRemove(query).exec();
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
