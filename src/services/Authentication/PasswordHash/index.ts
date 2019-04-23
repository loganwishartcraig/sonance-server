import { DatabaseService } from '../../Database';
import { Connection } from 'mongoose';
import { buildPasswordHashModel, IPasswordHash } from '../../../models/PasswordHash';

export class PasswordHashService extends DatabaseService<IPasswordHash> {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: buildPasswordHashModel,
        });
    }

}
