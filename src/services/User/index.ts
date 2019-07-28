import { IUser, IUserDocument } from '@models';
import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '@services/Database';

export interface IUserService extends IDatabaseService<IUserDocument, IUser> {
    findByEmail(email: string): Promise<IUserDocument | null>;
}
export type IUserServiceConfig = IDatabaseServiceConfig<IUserDocument>;

export class UserService
    extends DatabaseService<IUserDocument, IUser>
    implements IUserService {

    constructor(config: IUserServiceConfig) {
        super(config);
    }

    public async findByEmail(email: string): Promise<IUserDocument | null> {
        return this.findOne({ email });
    }

}
