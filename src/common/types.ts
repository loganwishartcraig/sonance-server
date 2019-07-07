export type Optional<T extends {}, Keys extends keyof T> = {
    [key in Keys]?: T[key];
};
