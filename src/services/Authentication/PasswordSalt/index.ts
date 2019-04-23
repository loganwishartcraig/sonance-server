import { Connection } from 'mongoose';
import { buildPasswordSaltModel, IPasswordSalt } from '../../../models/PasswordSalt';
import { DatabaseService } from '../../Database';

export class PasswordSaltService extends DatabaseService<IPasswordSalt> {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: buildPasswordSaltModel,
        });
    }

}
