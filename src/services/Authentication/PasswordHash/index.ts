import { DatabaseService, IDatabaseService } from '../../Database';
import { Connection } from 'mongoose';
import { PasswordHashModel } from '../../../models';
import { IPasswordHash, INewPasswordHashConfig } from '../../../models/PasswordHash';

export type IPasswordHashService = IDatabaseService<
    IPasswordHash,
    INewPasswordHashConfig
>;

export class PasswordHashService extends DatabaseService<
    IPasswordHash,
    INewPasswordHashConfig
    > implements IPasswordHashService {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: PasswordHashModel,
        });
    }

}
