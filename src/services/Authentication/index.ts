import argon2 from 'argon2';
import crypto from 'crypto';
import { IPasswordHash, INewPasswordHashConfig } from '../../models/PasswordHash';
import { IPasswordSalt, INewPasswordSaltConfig } from '../../models/PasswordSalt';
import { IRestrictedDatabaseService } from '../Database';

export interface IAuthenticationService {
    validateCredentials({ email, password }: IAuthenticationRequest): Promise<boolean>;
    setCredentials({ email, password }: IAuthenticationRequest): Promise<void>;
}

interface ISerializedHash {
    readonly salt: string;
    readonly hash: string;
}

export interface IAuthenticationRequest {
    readonly email: string;
    readonly password: string;
}

export interface IAuthenticationServiceConfig {
    passwordHashService: IRestrictedDatabaseService<IPasswordHash>;
    passwordSaltService: IRestrictedDatabaseService<IPasswordSalt>;
}

export class AuthenticationService implements IAuthenticationService {

    private readonly _passwordHashService: IRestrictedDatabaseService<IPasswordHash>;
    private readonly _passwordSaltService: IRestrictedDatabaseService<IPasswordSalt>;

    private readonly _prehashSecret: string = process.env.PASSWORD_PREHASH_SECRET as string;

    constructor({ passwordHashService, passwordSaltService }: IAuthenticationServiceConfig) {
        this._passwordHashService = passwordHashService;
        this._passwordSaltService = passwordSaltService;
    }

    public async validateCredentials(
        { email, password }: IAuthenticationRequest
    ): Promise<boolean> {

        const query: { email: string } = { email };

        const [hahsRec, saltRec] = await Promise.all([
            this._passwordHashService.findOne(query),
            this._passwordSaltService.findOne(query),
        ]);

        if (!hahsRec || !saltRec) {
            return false;
        } {

            const { hash } = hahsRec;
            const { salt } = saltRec;

            const prehash = this._prehashPassword(password);
            const deserialized = this._deserializeHash({ hash, salt });

            return argon2.verify(deserialized, prehash);

        }

    }

    public async setCredentials({ email, password }: IAuthenticationRequest): Promise<void> {

        const { hash, salt } = await this._resolveSerializedHash(password);

        const hashPayload: INewPasswordHashConfig = { email, hash };
        const saltPayload: INewPasswordSaltConfig = { email, salt };

        const query = { email };

        await Promise.all([
            this._passwordHashService.upsert(query, hashPayload),
            this._passwordSaltService.upsert(query, saltPayload),
        ]);

    }

    private async _resolveSerializedHash(password: string): Promise<ISerializedHash> {

        const hash = await this._hashPassword(password);
        return this._serializeHash(hash);

    }

    private async _hashPassword(password: string): Promise<string> {

        const prehash = this._prehashPassword(password);
        return this._getArgon2Hash(prehash);

    }

    private _prehashPassword(password: string): string {

        return crypto.createHmac('sha256', this._prehashSecret)
            .update(password)
            .digest('hex');

    }

    private async _getArgon2Hash(password: string): Promise<string> {
        return argon2.hash(password);
    }

    private _serializeHash(hashedPassword: string): ISerializedHash {

        const meta: string[] = hashedPassword.split('$');
        const hash: string = meta.pop() as string;

        const serialized: ISerializedHash = {
            hash,
            salt: meta.join('$'),
        };

        return serialized;
    }

    private _deserializeHash({ salt, hash }: ISerializedHash): string {

        return [salt, hash].join('$');

    }

}
