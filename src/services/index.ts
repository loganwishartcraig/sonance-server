import { createConnection, set as mongooseSet } from 'mongoose';
import { AuthenticationService, IAuthenticationService } from './Authentication';
import { PasswordHashService } from './Authentication/PasswordHash';
import { PasswordSaltService } from './Authentication/PasswordSalt';
import { BillService, IBillService } from './Bill';
import { IUserService, UserService } from './User';
import { userModelFactory, passwordHashModelFactory, passwordSaltModelFactory, billBodyModelFactory } from '../models';
import { DatabaseName } from '../constants/database_names';

require('dotenv').config();

// TODO Extract this into a 'mongoose config' file
// Sets mongoose configuration flags
mongooseSet('useCreateIndex', true);

const connection = createConnection(
    `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${DatabaseName.MODELS}`,
    { useNewUrlParser: true }
);

const handleDatabaseError = (...args: any[]) => {
    console.error('[Database] - Error encountered - ', ...args);
};

// TODO: Allow connection consumers to reject promises if connection fails
connection.on('error', handleDatabaseError);

export const userService = new UserService({ connection, modelFactory: userModelFactory });
export const authService = new AuthenticationService({
    passwordHashService: new PasswordHashService({ connection, modelFactory: passwordHashModelFactory }),
    passwordSaltService: new PasswordSaltService({ connection, modelFactory: passwordSaltModelFactory }),
});
export const billService = new BillService({ connection, modelFactory: billBodyModelFactory });

export { IAuthenticationService };
export { IUserService };
export { IBillService };
