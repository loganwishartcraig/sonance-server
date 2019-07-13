import { IDatabaseService, IDatabaseServiceConfig, DatabaseService } from '@services/Database';
import { IUser, IUserConfig } from '@models';

export interface IUserService extends IDatabaseService<IUser, IUserConfig> {
    findByEmail(email: string): Promise<IUser | void>;
}
export type IUserServiceConfig = IDatabaseServiceConfig<IUser>;

export class UserService
    extends DatabaseService<IUser, IUserConfig>
    implements IUserService {

    constructor(config: IUserServiceConfig) {
        super(config);
    }

    public async findByEmail(email: string): Promise<IUser | void> {
        return this.findOne({ email });
    }

}
