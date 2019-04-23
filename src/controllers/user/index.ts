import { RequestHandler } from 'express-serve-static-core';
import { userService } from '../../services/Index';

export class UserController {
    public static createUser: RequestHandler = async (req, res, next) => {
        try {
            await userService.insert(req.body);
            next();
        } catch (e) {
            return res.status(422).json({ error: e.message });
        }
    }
}
