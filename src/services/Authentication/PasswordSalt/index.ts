import { IPasswordSaltConfig, IPasswordSalt } from '../../../models';
import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '../../Database';

export type IPasswordSaltService = IDatabaseService<IPasswordSalt, IPasswordSaltConfig>;
export type IPasswordSaltServiceConfig = IDatabaseServiceConfig<IPasswordSalt>;

export class PasswordSaltService
    extends DatabaseService<IPasswordSalt, IPasswordSaltConfig>
    implements IPasswordSaltService {

    constructor(config: IPasswordSaltServiceConfig) {
        super(config);
    }

}
