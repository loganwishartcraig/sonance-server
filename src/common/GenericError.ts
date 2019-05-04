interface IGenericError {
    readonly code: string;
    readonly message: string;
    readonly httpStatus: number;
    readonly meta?: any;
}

export class GenericError extends Error implements IGenericError {

    public readonly code: string;
    public readonly httpStatus: number;
    public readonly message: string;
    public readonly stack: string;
    public readonly meta: any;

    constructor(config: IGenericError) {
        super(config.code);
        this.code = config.code;
        this.httpStatus = config.httpStatus;
        this.message = config.message;
        this.stack = this._resolveStack();
        this.meta = config.meta;

        console.error('[GenericError] - Constructed', {
            code: this.code,
            message: this.message,
            stack: this.stack,
            meta: this.meta,
        });
    }

    private _resolveStack: () => string = () => {

        const stackContainer: { stack: string } = { stack: '' };

        if (Error.captureStackTrace) {
            Error.captureStackTrace(stackContainer);
        } else {
            stackContainer.stack = this._getStackViaThrow();
        }

        return stackContainer.stack;

    }

    private _getStackViaThrow: () => string = () => {
        try {
            throw new Error();
        } catch (e) {
            return e && e.stack;
        }
    }

    public toJSON(): { code: string, message: string, meta?: any } {

        return {
            code: this.code,
            message: this.message,
            ...(this.meta ? { meta: this.meta } : {}),
        };

    }

}
