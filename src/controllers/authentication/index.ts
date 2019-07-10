import { RequestHandler, Request, Response } from 'express-serve-static-core';
import { authService, IAuthenticationService } from '../../services';
import passport = require('passport');
import { GenericError } from '../../common/GenericError';
import { AuthenticationErrorCode } from '../../constants/error_codes';
import { wrapCatch } from '../../common/Utilities';
import { IUser } from '../../models';

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

    public checkAuth: RequestHandler = (req, _res, next) => {

        if (req.isAuthenticated()) {
            return next();
        }

        return next(new GenericError({
            code: AuthenticationErrorCode.NOT_AUTHORIZED,
            message: 'You are not authorized to perform that action',
            httpStatus: 401,
        }));

    }

    public authenticateLocal: RequestHandler = (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {

            if (err) {
                return next(err);
            }

            req.logIn(user, (loginErr) => {
                if (loginErr) next(loginErr);
                return res.status(200).json({ user });
            });

        })(req, res, next);
    }

    public setCredentials: RequestHandler = wrapCatch(async (req, _res, next) => {

        const { email, password } = req.body;

        await this._authService.setCredentials({ email, password });

        next();

    });

    public logout: RequestHandler = (req, res) => {
        req.logout();
        return res.sendStatus(204);
    }

    public matchesAuthenticatedUserId = (
        selector: (req: Request, res: Response) => string
    ): RequestHandler => (req, res, next) => {

        if (!req.isAuthenticated()) {
            return next(new GenericError({
                code: AuthenticationErrorCode.NOT_AUTHORIZED,
                httpStatus: 401,
                message: 'You are not logged in.',
            }));
        }

        try {

            const selectedUserId = selector(req, res);

            if (selectedUserId === (req.user as IUser)._id.toHexString()) {
                return next();
            }

        } catch (e) {
            console.error('[AuthenticationController] - matchesAuthenticatedUserId() - Failed to select userId');
        }

        return next(new GenericError({
            code: AuthenticationErrorCode.NOT_AUTHORIZED,
            httpStatus: 401,
            message: 'You are not authorized to view content for that user.',
        }));
    }

}

const authController = new AuthenticationController(authService);

export default authController;
