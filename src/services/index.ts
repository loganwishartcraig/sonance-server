import { createConnection } from 'mongoose';
import { AuthenticationService, IAuthenticationService } from './Authentication';
import { UserService, IUserService } from './User';
require('dotenv').config();

const enum DatabaseName {
    MODELS = 'models',
}

const connection = createConnection(
    `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${DatabaseName.MODELS}`,
    { useNewUrlParser: true }
);

const handleDatabaseError = (...args: any[]) => {
    console.error('[Database] - Error encountered - ', ...args);
};

// TODO: Allow connection consumers to reject promises if connection fails
connection.on('error', handleDatabaseError);

export const userService = new UserService(connection);
export const authService = new AuthenticationService(connection);

export { IAuthenticationService };
export { IUserService };
