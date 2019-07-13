
import { Router } from 'express';
import { rootGetRouter } from './get';
import { rootPostRouter } from './post';
import { rootPutRouter } from './put';
import { billIdRoutes } from './billId';

export const billRoutes: Router[] = [
    rootGetRouter,
    rootPostRouter,
    rootPutRouter,
    billIdRoutes,
];
