import { RequestHandler } from 'express-serve-static-core';
import { userService, IUserService } from '../../services';
import { GenericError } from '../../common/GenericError';
import { wrapCatch } from '../../common/Utilities';
import { DatabaseServiceErrorCode } from '../../constants/error_codes';

class UserController {

    private readonly _userService: IUserService;

    constructor(service: IUserService) {
        this._userService = userService;
    }

    public createUser: RequestHandler = wrapCatch(async (req, res, next) => {

        if (await this._userService.findByEmail(req.body.email)) {
            throw new GenericError({
                code: DatabaseServiceErrorCode.RECORD_ALREADY_EXISTS,
                message: 'A user with that email already exists.',
                httpStatus: 422,
            });
        }

        await this._userService.insert(req.body);

        next();

    });

}

const userController = new UserController(userService);

export default userController;
