// import { Connection } from 'mongoose';
// import { DatabaseService, IDatabaseService } from '../Database';
// import { IBill } from '../../models/Bill';

// export interface IBillService extends IDatabaseService {
//     findByEmail(email: string): Promise<IBill | undefined>;
// }

// export interface IBillCreate {
//     readonly email: string;
// }

// export class UserService extends DatabaseService<IBill> implements IBillService {

//     constructor(connection: Connection) {
//         super({
//             connection,
//             modelFactory: buildUserModel,
//         });
//     }

//     public async findByEmail(email: string): Promise<IUser | undefined> {
//         return this.findOne({ email });
//     }

//     protected _formatForInsert(payload: IUserCreate): IUserSchema {

//         return {
//             email: payload.email,
//             firstName: payload.firstName,
//             lastName: payload.lastName,
//         };

//     }

// }
