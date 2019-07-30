import { ErrorCode } from '@constants/error_codes';
import { Response } from 'express';
import { globalErrorFactory } from './ErrorFactory';
import { GenericError } from './GenericError';
import { IResponseLocals } from './types';

export const extractLocalResponseValue = <T extends keyof IResponseLocals>(
    res: Response,
    key: T
): Required<IResponseLocals>[T] => {

    const value = res.locals[key];

    if (value == null) {
        throw _buildLocalNotProvidedError(key);
    }

    return value;

};

const _buildLocalNotProvidedError = (key: keyof IResponseLocals, meta: any = {}): GenericError => {

    const recType = _resolveLocalPropRecTypeString(key);

    return globalErrorFactory.build(ErrorCode.INTERNAL_ERROR, {
        meta,
        message: `The ${recType} was not properly loaded on the server.`,
    });

};

const _resolveLocalPropRecTypeString = (key: keyof IResponseLocals): string => {

    switch (key) {
        case 'bill':
        case 'bills':
        case 'billUpdates':
            return 'bill';
        case 'line':
        case 'lines':
        case 'lineUpdates':
            return 'line';
        case 'participant':
        case 'participants':
        case 'participantUpdates':
            return 'participant';
        default:
            return 'record';
    }

};
