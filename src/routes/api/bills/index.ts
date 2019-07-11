
import { Router } from 'express';
import { rootGetRouter } from './root/get';
import { rootPostRouter } from './root/post';
import { rootPutRouter } from './root/put';
import { getBillRouter } from './bill/get';

export const billRoutes: Router[] = [
    rootGetRouter,
    rootPostRouter,
    rootPutRouter,
    getBillRouter,
];
