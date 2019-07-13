import { IPasswordHashConfig, IPasswordHash } from '../../../models';
import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '../../Database';

export type IPasswordHashService = IDatabaseService<IPasswordHash, IPasswordHashConfig>;
export type IPasswordHashServiceConfig = IDatabaseServiceConfig<IPasswordHash>;

export class PasswordHashService
    extends DatabaseService<IPasswordHash, IPasswordHashConfig>
    implements IPasswordHashService {

    constructor(config: IPasswordHashServiceConfig) {
        super(config);
    }

}
