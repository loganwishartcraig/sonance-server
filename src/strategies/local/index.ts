import { Strategy as LocalStrategy, IStrategyOptions, VerifyFunction } from 'passport-local';
import { GenericError } from '../../common/GenericError';
import { AuthenticationErrorCode, DatabaseServiceErrorCode } from '../../constants/error_codes';
import { userService, authService } from '../../services';
import { wrapCatch } from '../../common/Utilities';

const generateAuthFailedError = (): GenericError => {

    const message = `We were unable to authenticate you. \
Please double check your credentials and try again`;

    return new GenericError({
        message,
        httpStatus: 422,
        code: AuthenticationErrorCode.AUTHENTICATION_FAILED,
    });

};

const localStrategyOptions: IStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
};

const verifyLocalAuth: VerifyFunction = wrapCatch(async (email, password, done) => {

    const credentialsValid = await authService.validateCredentials({ email, password });

    if (!credentialsValid) {
        throw generateAuthFailedError();
    }

    const user = await userService.findByEmail(email);

    if (!user) {
        throw new GenericError({
            code: DatabaseServiceErrorCode.RECORD_NOT_FOUND,
            message: 'Internal Error: User information not found after logging in.',
            httpStatus: 500,
        });
    }

    return done(null, user);

});

export const localStrategy = new LocalStrategy(localStrategyOptions, verifyLocalAuth);
