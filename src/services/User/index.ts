import { Connection } from 'mongoose';
import { buildUserModel, IUser, IUserSchema } from '../../models/User';
import { DatabaseService } from '../Database';

export interface IUserService {
    readonly connection: Connection;
}

export interface IUserCreate {
    readonly email: string;
    readonly nameFirst: string;
    readonly nameLast: string;
}

export class UserService extends DatabaseService<IUser> {

    constructor(connection: Connection) {
        super({
            connection,
            modelFactory: buildUserModel,
        });
    }

    public async findByEmail(email: string): Promise<IUser> {
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
