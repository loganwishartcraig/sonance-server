
import { Router } from 'express';
import { rootGetRouter } from './get';
import { rootPostRouter } from './post';
import { rootPutRouter } from './put';
import { billIdRoutes } from './billId';
import { joinBillRouter } from './join/post';

export const billRoutes: Router[] = [
    rootGetRouter,
    rootPostRouter,
    rootPutRouter,
    joinBillRouter,
    billIdRoutes,
];
