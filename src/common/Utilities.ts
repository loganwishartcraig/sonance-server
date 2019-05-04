
export const wrapCatch = <P, Args extends [any] | any[]>(
    fn: (...args: Args) => Promise<P>
) => (
    ...args: Args
) => fn(...args).catch((err: any) => {
    args[args.length - 1](err);
});
