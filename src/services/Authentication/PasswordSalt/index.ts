import { IDatabaseService, IDatabaseServiceConfig, DatabaseService } from '@services/Database';
import { IPasswordSalt, IPasswordSaltConfig } from '@models';

export type IPasswordSaltService = IDatabaseService<IPasswordSalt, IPasswordSaltConfig>;
export type IPasswordSaltServiceConfig = IDatabaseServiceConfig<IPasswordSalt>;

export class PasswordSaltService
    extends DatabaseService<IPasswordSalt, IPasswordSaltConfig>
    implements IPasswordSaltService {

    constructor(config: IPasswordSaltServiceConfig) {
        super(config);
    }

}
