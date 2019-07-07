import { INewUserConfig, IUser } from '../../models';
import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '../Database';

export interface IUserService extends IDatabaseService<IUser, INewUserConfig> {
    findByEmail(email: string): Promise<IUser | undefined>;
}
export type IUserServiceConfig = IDatabaseServiceConfig<IUser>;

export class UserService
    extends DatabaseService<IUser, INewUserConfig>
    implements IUserService {

    constructor(config: IUserServiceConfig) {
        super(config);
    }

    public async findByEmail(email: string): Promise<IUser | undefined> {
        return this.findOne({ email });
    }

}
