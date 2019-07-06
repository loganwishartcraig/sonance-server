import { SchemaTypeOpts } from 'mongoose';

export type SchemaValidator<T = any> = [SchemaTypeOpts.ValidateFn<T>, string];

const schemaValidators = {

    gt: (
        value: number,
        msg: string = 'The amount entered exceeds the allowed maximum'
    ): SchemaValidator<number> => [
            test => test > value,
            msg,
        ],

    gte: (
        value: number,
        msg: string = 'The amount entered exceeds the allowed maximum'
    ): SchemaValidator<number> => [
            test => test >= value,
            msg,
        ],

    lt: (
        value: number,
        msg: string = 'The amount entered is below the allowed minimum'
    ): SchemaValidator<number> => [
            test => test < value,
            msg,
        ],

    lte: (
        value: number,
        msg: string = 'The amount entered is below the allowed minimum'
    ): SchemaValidator<number> => [
            test => test <= value,
            msg,
        ],

    eq: <T = any>(
        value: T,
        msg: string = 'The value provided is not allowed'
    ): SchemaValidator<T> => [
            test => test === value,
            msg,
        ],

    neq: (
        value: number,
        msg: string = 'The value provided is not allowed'
    ): SchemaValidator<number> => [
            test => test !== value,
            msg,
        ],

    gtez: (
        msg: string = 'The provided value cannot be negative'
    ): SchemaValidator<number> => [
            test => test >= 0,
            msg,
        ],

    gtz: (
        msg: string = 'The provided value must be larger than zero'
    ): SchemaValidator<number> => [
            test => test > 0,
            msg,
        ],

    inEnum: <T extends {}>(
        enumeration: T,
        msg: string = 'The provided value is not allowed'
    ): SchemaValidator<string | number> => [
            test => Object.values(enumeration).includes(test),
            msg,
        ],

    isLength: <T extends { length: number }>(
        {
            min = Number.NEGATIVE_INFINITY,
            max = Number.POSITIVE_INFINITY,
            exactly,
        }: {
            min?: number;
            max?: number;
            exactly?: number;
        },
        msg: string = 'The provided values length is invalid'
    ): SchemaValidator<T> => [
            ({ length }) => (typeof exactly !== 'number' || exactly === length) && (min <= length && length <= max),
            msg,
        ],

};

export default schemaValidators;
