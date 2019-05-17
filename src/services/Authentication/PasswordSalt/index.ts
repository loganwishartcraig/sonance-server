import { Connection } from 'mongoose';
import { buildPasswordSaltModel, IPasswordSalt, INewPasswordSaltConfig } from '../../../models/PasswordSalt';
import { DatabaseService, IDatabaseService } from '../../Database';

export type IPasswordSaltService = IDatabaseService<IPasswordSalt, INewPasswordSaltConfig>;

export class PasswordSaltService
    extends DatabaseService<IPasswordSalt, INewPasswordSaltConfig>
    implements IPasswordSaltService {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: buildPasswordSaltModel,
        });
    }

}
