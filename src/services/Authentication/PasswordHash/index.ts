import { DatabaseService, IDatabaseService } from '../../Database';
import { Connection } from 'mongoose';
import {
    buildPasswordHashModel as modelFactory,
    IPasswordHash,
    INewPasswordHashConfig
} from '../../../models/PasswordHash';

export type IPasswordHashService = IDatabaseService<IPasswordHash, INewPasswordHashConfig>;

export class PasswordHashService extends DatabaseService<IPasswordHash, INewPasswordHashConfig> {

    constructor(connection: Connection) {
        super({ connection, modelFactory, });
    }

}
