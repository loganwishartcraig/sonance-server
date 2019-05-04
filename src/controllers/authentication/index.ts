import { RequestHandler } from 'express-serve-static-core';
import { authService, IAuthenticationService } from '../../services';
import passport = require('passport');
import { GenericError } from '../../common/GenericError';
import { AuthenticationErrorCode } from '../../constants/error_codes';
import { wrapCatch } from '../../common/Utilities';

export interface ILoginBody {
    readonly email: string;
    readonly password: string;
}

export interface IRegistrationBody {
    readonly email: string;
    readonly password: string;
    readonly nameFirst: string;
    readonly nameLast: string;
}

class AuthenticationController {

    private readonly _authService: IAuthenticationService;

    constructor(service: IAuthenticationService) {
        this._authService = service;
    }

    public checkAuth: RequestHandler = (req, res) => {
        if (req.isAuthenticated()) {
            return res.status(200).json({ hasAuth: true });
        }
        return res.status(200).json({ hasAuth: false });
    }

    public authenticateLocal: RequestHandler = (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {

            if (err) {
                next(err);
            } else if (!user) {
                next(new GenericError({
                    httpStatus: 422,
                    code: AuthenticationErrorCode.INVALID_CREDENTIALS,
                    message: 'Incorrect email or password. Please try again.',
                }));
            }

            req.logIn(user, (loginErr) => {
                if (loginErr) throw loginErr;
                return res.status(200).json({ user });
            });

        })(req, res, next);
    }

    public setCredentials: RequestHandler = wrapCatch(async (req, res, next) => {

        const { email, password } = req.body;

        await this._authService.setCredentials({ email, password });

        next();

    });

}

const authController = new AuthenticationController(authService);

export default authController;
