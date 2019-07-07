import { Connection } from 'mongoose';
import { INewPasswordHashConfig, IPasswordHash, passwordHashModelFactory } from '../../../models';
import { DatabaseService, IDatabaseService } from '../../Database';

export type IPasswordHashService = IDatabaseService<IPasswordHash, INewPasswordHashConfig>;

export class PasswordHashService
    extends DatabaseService<IPasswordHash, INewPasswordHashConfig>
    implements IPasswordHashService {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: passwordHashModelFactory,
        });
    }

}
