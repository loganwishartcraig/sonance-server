import { Connection } from 'mongoose';
import { buildUserModel, IUser, IUserSchema } from '../../models/User';
import { DatabaseService, IDatabaseService } from '../Database';

export interface IUserService extends IDatabaseService {
    findByEmail(email: string): Promise<IUser | undefined>;
}

export interface IUserCreate {
    readonly email: string;
    readonly nameFirst: string;
    readonly nameLast: string;
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

    protected _formatForInsert(payload: IUserCreate): IUserSchema {

        return {
            email: payload.email,
            name: {
                first: payload.nameFirst,
                last: payload.nameLast,
            },
        };

    }

}
