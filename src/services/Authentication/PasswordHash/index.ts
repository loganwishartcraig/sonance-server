import { INewPasswordHashConfig, IPasswordHash } from '../../../models';
import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '../../Database';

export type IPasswordHashService = IDatabaseService<IPasswordHash, INewPasswordHashConfig>;
export type IPasswordHashServiceConfig = IDatabaseServiceConfig<IPasswordHash>;

export class PasswordHashService
    extends DatabaseService<IPasswordHash, INewPasswordHashConfig>
    implements IPasswordHashService {

    constructor(config: IPasswordHashServiceConfig) {
        super(config);
    }

}
