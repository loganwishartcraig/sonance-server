
import { Router } from 'express';
import { rootGetRouter } from './root/get';
import { rootPostRouter } from './root/post';

export const billRoutes: Router[] = [
    rootGetRouter,
    rootPostRouter,
];
