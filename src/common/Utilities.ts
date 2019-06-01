
export const wrapCatch = <P, Args extends [any] | any[]>(
    fn: (...args: Args) => Promise<P>
) => (
    ...args: Args
) => fn(...args).catch((err: any) => {
    args[args.length - 1](err);
});

export const pick = <R extends {}, T extends {}>(obj: T, keys: ((keyof T) & (keyof R))[]) => {

    const base: any = {};

    return keys.reduce(
        (picked, key) => {
            picked[key] = obj[key];
            return base;
        },
        base
    ) as R;

};
