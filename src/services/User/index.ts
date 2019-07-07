import { Connection } from 'mongoose';
import { DatabaseService, IDatabaseService } from '../Database';
import { IUser, INewUserConfig, userModelFactory } from '../../models';

export interface IUserService extends IDatabaseService<IUser, INewUserConfig> {
    findByEmail(email: string): Promise<IUser | undefined>;
}

export class UserService
    extends DatabaseService<IUser, INewUserConfig>
    implements IUserService {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: userModelFactory,
        });
    }

    public async findByEmail(email: string): Promise<IUser | undefined> {
        return this.findOne({ email });
    }

}
