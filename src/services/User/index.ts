import { Connection } from 'mongoose';
import modelFactory, { INewUserConfig, IUser } from '../../models/User';
import { DatabaseService, IDatabaseService } from '../Database';

export interface IUserService extends IDatabaseService<IUser, INewUserConfig> {
    findByEmail(email: string): Promise<IUser | undefined>;
}

export class UserService
    extends DatabaseService<IUser, INewUserConfig>
    implements IUserService {

    constructor(connection: Connection) {
        super({ connection, modelFactory });
    }

    public async findByEmail(email: string): Promise<IUser | undefined> {
        return this.findOne({ email });
    }

}
