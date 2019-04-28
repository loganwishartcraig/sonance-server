import { createConnection } from 'mongoose';
import { AuthenticationService } from './Authentication';
import { UserService } from './User';
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
export const authenticationService = new AuthenticationService(connection);
