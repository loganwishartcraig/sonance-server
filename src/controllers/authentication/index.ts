import { RequestHandler } from 'express-serve-static-core';

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

export class AuthenticationController {

    public static checkAuth: RequestHandler = (req, res) => {
        if (req.isAuthenticated()) {
            return res.status(200).json({ hasAuth: true });
        }
        return res.status(200).json({ hasAuth: false });
    }

}
