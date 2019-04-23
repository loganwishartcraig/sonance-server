import { Strategy as LocalStrategy, IStrategyOptions, VerifyFunction } from 'passport-local';
import { GenericError } from '../../common/GenericError';
import { AuthenticationErrorCode, DatabaseServiceErrorCode } from '../../constants/error_codes';
import { userService } from '../../services/Index';

const generateAuthFailedError = (): GenericError => {

    const message = `We were unable to authenticate you. \
Please double check your credentials and try again`;

    return new GenericError({
        message,
        code: AuthenticationErrorCode.AUTHENTICATION_FAILED,
    });

};

const localStrategyOptions: IStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
};

const verifyLocalAuth: VerifyFunction = async (email, password, done) => {

    try {

        // TODO: Implement actual password checking...
        const user = await userService.findByEmail(email);

        return done(null, user);

    } catch (e) {

        if (e.code === DatabaseServiceErrorCode.RECORD_NOT_FOUND) {
            return done(null, false);
        }

        done(generateAuthFailedError());
    }

};

export const localStrategy = new LocalStrategy(localStrategyOptions, verifyLocalAuth);
