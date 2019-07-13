import { ErrorFactoryBase, globalErrorFactory } from '@common/ErrorFactory';
import { wrapCatch } from '@common/Utilities';
import { ErrorCode } from '@constants/error_codes';
import { IUserService, userService } from '@services';
import { RequestHandler } from 'express-serve-static-core';
import { IUserConfig } from '@models';

class UserController {

    private readonly _userService: IUserService;
    private readonly _errorFactory: ErrorFactoryBase;

    constructor(
        service: IUserService,
        errorFactory: ErrorFactoryBase
    ) {
        this._userService = service;
        this._errorFactory = errorFactory;
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
    }: any): IUserConfig {
        return { email, displayName, avatar };
    }

}

export const userController = new UserController(
    userService,
    globalErrorFactory
);
