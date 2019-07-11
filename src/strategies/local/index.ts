import { Strategy as LocalStrategy, IStrategyOptions, VerifyFunction } from 'passport-local';
import { GenericError } from '../../common/GenericError';
import { userService, authService } from '../../services';
import { wrapCatch } from '../../common/Utilities';
import { globalErrorFactory } from '../../common/ErrorFactory';
import { ErrorCode } from '../../constants/error_codes';

const generateAuthFailedError = (): GenericError => {

    const message = `We were unable to authenticate you. \
Please double check your credentials and try again`;

    return globalErrorFactory.build(ErrorCode.AUTHENTICATION_FAILED, { message });

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
        globalErrorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
            message: 'Internal Error: User information not found after logging in.',
            httpStatus: 500,
        });
    }

    return done(null, user);

});

export const localStrategy = new LocalStrategy(localStrategyOptions, verifyLocalAuth);
