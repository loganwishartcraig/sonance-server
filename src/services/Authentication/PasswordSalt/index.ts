import { Connection } from 'mongoose';
import modelFactory, { INewPasswordSaltConfig, IPasswordSalt } from '../../../models/PasswordSalt';
import { DatabaseService, IDatabaseService } from '../../Database';

export type IPasswordSaltService = IDatabaseService<IPasswordSalt, INewPasswordSaltConfig>;
export class PasswordSaltService
    extends DatabaseService<IPasswordSalt, INewPasswordSaltConfig>
    implements IPasswordSaltService {

    constructor(connection: Connection) {
        super({ connection, modelFactory });
    }

}
