import { createConnection, set as mongooseSet } from 'mongoose';
import { DatabaseName } from '@constants/database_names';
import { UserService } from './User';
import { AuthenticationService } from './Authentication';
import { PasswordHashService } from './Authentication/PasswordHash';
import { PasswordSaltService } from './Authentication/PasswordSalt';
import { userModelFactory, passwordHashModelFactory, passwordSaltModelFactory, billBodyModelFactory } from '@models';
import { BillService } from './Bill';
import { globalErrorFactory as errorFactory } from '@common/ErrorFactory';
import ParticipantService from './Participant';
import { LineItemService } from './LineItem';

require('dotenv').config();

export { IAuthenticationService } from './Authentication';
export { IBillService } from './Bill';
export { IParticipantService as IBillParticipantService } from './Participant';
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
    errorFactory,
} as const;

export const userService = new UserService({ ...genericServiceConfig, modelFactory: userModelFactory });
export const authService = new AuthenticationService({
    passwordHashService: new PasswordHashService({ ...genericServiceConfig, modelFactory: passwordHashModelFactory }),
    passwordSaltService: new PasswordSaltService({ ...genericServiceConfig, modelFactory: passwordSaltModelFactory }),
});
export const billService = new BillService({ ...genericServiceConfig, modelFactory: billBodyModelFactory });
export const lineItemService = new LineItemService({ errorFactory });
export const participantService = new ParticipantService({ errorFactory });
