import passport = require('passport');
import { ErrorFactoryBase, globalErrorFactory } from '@common/ErrorFactory';
import { wrapCatch } from '@common/Utilities';
import { ErrorCode } from '@constants/error_codes';
import { IUser } from '@models';
import { authService, IAuthenticationService } from '@services';
import { RequestHandler, Response } from 'express';
import { Request } from 'express-serve-static-core';

class AuthenticationController {

    private readonly _authService: IAuthenticationService;
    private readonly _errorFactory: ErrorFactoryBase;

    constructor(
        service: IAuthenticationService,
        errorFactory: ErrorFactoryBase
    ) {
        this._authService = service;
        this._errorFactory = errorFactory;
    }

    public checkAuth: RequestHandler = (req, _res, next) => {

        if (req.isAuthenticated()) {
            return next();
        }

        return next(this._errorFactory.build(ErrorCode.NOT_AUTHENTICATED));

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
            return next(this._errorFactory.build(ErrorCode.NOT_AUTHORIZED));
        }

        try {

            const selectedUserId = selector(req, res);

            if (selectedUserId === (req.user as IUser).id) {
                return next();
            }

        } catch (e) {
            console.error('[AuthenticationController] - matchesAuthenticatedUserId() - Failed to select userId');
        }

        return next(this._errorFactory.build(ErrorCode.NOT_AUTHORIZED));
    }

}

export const authController = new AuthenticationController(
    authService,
    globalErrorFactory
);
