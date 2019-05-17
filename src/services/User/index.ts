import { Connection } from 'mongoose';
import { buildUserModel, IUser, INewUserConfig } from '../../models/User';
import { DatabaseService, IDatabaseService } from '../Database';

export interface IUserService extends IDatabaseService {
    findByEmail(email: string): Promise<IUser | undefined>;
}

export interface IUserCreate {
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
}

export class UserService extends DatabaseService<IUser> implements IUserService {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: buildUserModel,
        });
    }

    public async findByEmail(email: string): Promise<IUser | undefined> {
        return this.findOne({ email });
    }

    protected _formatForInsert(payload: IUserCreate): INewUserConfig {

        return {
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
        };

    }

}
