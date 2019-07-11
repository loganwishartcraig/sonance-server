import { RequestHandler } from 'express-serve-static-core';
import { userService, IUserService } from '../../services';
import { GenericError } from '../../common/GenericError';
import { wrapCatch } from '../../common/Utilities';
import { INewUserConfig } from '../../models/User';
import { ErrorFactoryBase, globalErrorFactory } from '../../common/ErrorFactory';
import { ErrorCode } from '../../constants/error_codes';

class UserController {

    private readonly _userService: IUserService;
    private readonly _errorFactory: ErrorFactoryBase;

    constructor(
        service: IUserService,
        errorFactory: ErrorFactoryBase
    ) {
        this._userService = service;
    }

    public createUser: RequestHandler = wrapCatch(async (req, res, next) => {

        if (await this._userService.findByEmail(req.body.email)) {
            throw this._errorFactory.build(ErrorCode.RECORD_ALREADY_EXISTS, {
                message: 'A user with that email already exists.',
            });
        }

        const creationConf = this._parseBodyForCreation(req.body);

        await this._userService.insert(creationConf);

        next();

    });

    /**
     * Serialize the request body here, stripping extra properties.
     * Express-validator doesn't support throwing on non-validated props.
     * We don't check prop validity here, it should be done prior to calling.
     */
    private _parseBodyForCreation({
        email,
        displayName,
        avatar,
    }: any): INewUserConfig {
        return { email, displayName, avatar };
    }

}

const userController = new UserController(
    userService,
    globalErrorFactory
);

export default userController;
