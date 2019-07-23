import { createConnection, set as mongooseSet } from 'mongoose';
import { DatabaseName } from '@constants/database_names';
import { UserService } from './User';
import { AuthenticationService } from './Authentication';
import { PasswordHashService } from './Authentication/PasswordHash';
import { PasswordSaltService } from './Authentication/PasswordSalt';
import { userModelFactory, passwordHashModelFactory, passwordSaltModelFactory, billBodyModelFactory } from '@models';
import { BillService } from './Bill';
import { globalErrorFactory } from '@common/ErrorFactory';
import BillParticipantService from './BillParticipant';

require('dotenv').config();

export { IAuthenticationService } from './Authentication';
export { IBillService } from './Bill';
export { IBillParticipantService } from './BillParticipant';
export { IUserService } from './User';

// TODO Extract this into a 'mongoose config' file
// Sets mongoose configuration flags
mongooseSet('useCreateIndex', true);
mongooseSet('useFindAndModify', false);

const connection = createConnection(
    `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${DatabaseName.MODELS}`,
    { useNewUrlParser: true }
);

const handleDatabaseError = (...args: any[]) => {
    console.error('[Database] - Error encountered - ', ...args);
};

// TODO: Allow connection consumers to reject promises if connection fails
connection.on('error', handleDatabaseError);

const genericServiceConfig = {
    connection,
    errorFactory: globalErrorFactory,
} as const;

export const userService = new UserService({ ...genericServiceConfig, modelFactory: userModelFactory });
export const authService = new AuthenticationService({
    passwordHashService: new PasswordHashService({ ...genericServiceConfig, modelFactory: passwordHashModelFactory }),
    passwordSaltService: new PasswordSaltService({ ...genericServiceConfig, modelFactory: passwordSaltModelFactory }),
});
export const billService = new BillService({ ...genericServiceConfig, modelFactory: billBodyModelFactory });
export const billParticipantService = new BillParticipantService({ billService, errorFactory: globalErrorFactory });
