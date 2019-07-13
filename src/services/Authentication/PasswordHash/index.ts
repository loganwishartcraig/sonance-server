import { IDatabaseService, IDatabaseServiceConfig, DatabaseService } from '@services/Database';
import { IPasswordHash, IPasswordHashConfig } from '@models';

export type IPasswordHashService = IDatabaseService<IPasswordHash, IPasswordHashConfig>;
export type IPasswordHashServiceConfig = IDatabaseServiceConfig<IPasswordHash>;

export class PasswordHashService
    extends DatabaseService<IPasswordHash, IPasswordHashConfig>
    implements IPasswordHashService {

    constructor(config: IPasswordHashServiceConfig) {
        super(config);
    }

}
