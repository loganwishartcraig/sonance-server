import { Connection } from 'mongoose';
import { DatabaseService, IDatabaseService } from '../../Database';
import { passwordSaltModelFactory, IPasswordSalt, INewPasswordSaltConfig } from '../../../models';

export type IPasswordSaltService = IDatabaseService<IPasswordSalt, INewPasswordSaltConfig>;
export class PasswordSaltService
    extends DatabaseService<IPasswordSalt, INewPasswordSaltConfig>
    implements IPasswordSaltService {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: passwordSaltModelFactory,
        });
    }

}
