export type Omit<T extends {}, Keys extends keyof T> = Pick<T, Exclude<keyof T, Keys>>;

export type Optional<T extends {}, Keys extends keyof T> = {
    [key in Keys]?: T[key];
};
