import { INewPasswordSaltConfig, IPasswordSalt } from '../../../models';
import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '../../Database';

export type IPasswordSaltService = IDatabaseService<IPasswordSalt, INewPasswordSaltConfig>;
export type IPasswordSaltServiceConfig = IDatabaseServiceConfig<IPasswordSalt>;

export class PasswordSaltService
    extends DatabaseService<IPasswordSalt, INewPasswordSaltConfig>
    implements IPasswordSaltService {

    constructor(config: IPasswordSaltServiceConfig) {
        super(config);
    }

}
