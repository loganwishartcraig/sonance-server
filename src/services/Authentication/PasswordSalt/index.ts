import { IPasswordSalt, IPasswordSaltDocument } from '@models';
import { IDatabaseServiceConfig } from '@services/Database';
import { IRestrictedDatabaseService, RestrictedDatabaseService } from '@services/RestrictedDatabase';

export type IPasswordSaltService = IRestrictedDatabaseService<IPasswordSalt>;
export type IPasswordSaltServiceConfig = IDatabaseServiceConfig<IPasswordSaltDocument>;

export class PasswordSaltService
    extends RestrictedDatabaseService<IPasswordSaltDocument, IPasswordSalt>
    implements IPasswordSaltService {

    constructor(config: IPasswordSaltServiceConfig) {
        super(config);
    }

}
