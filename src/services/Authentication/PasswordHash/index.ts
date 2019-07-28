import { IPasswordHash, IPasswordHashDocument } from '@models';
import { IDatabaseServiceConfig } from '@services/Database';
import { IRestrictedDatabaseService, RestrictedDatabaseService } from '@services/RestrictedDatabase';

export type IPasswordHashService = IRestrictedDatabaseService<IPasswordHash>;
export type IPasswordHashServiceConfig = IDatabaseServiceConfig<IPasswordHashDocument>;

export class PasswordHashService
    extends RestrictedDatabaseService<IPasswordHashDocument, IPasswordHash>
    implements IPasswordHashService {

    constructor(config: IPasswordHashServiceConfig) {
        super(config);
    }

}
