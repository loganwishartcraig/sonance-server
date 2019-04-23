interface IGenericError {
    readonly code: string;
    readonly message: string;
    readonly meta?: any;
}

export class GenericError extends Error {

    public readonly code: string;
    public readonly message: string;
    public readonly stack: string;
    public readonly meta: any;

    constructor(config: IGenericError) {
        super(config.code);
        this.code = config.code;
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

    public toJSON(): { code: string, message: string } {
        return {
            code: this.code,
            message: this.message,
        };
    }

}
